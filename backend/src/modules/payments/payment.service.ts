import crypto from "crypto";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { releaseBookingHold } from "../booking/bookingHold";
import { issueRefund } from "./razorpayRefund";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;


function verifySignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

interface RazorpayNotes {
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  holdId: string;
  guests: string;
}

export async function processRazorpayWebhook(
  rawBody: Buffer,
  signature: string | undefined,
  eventId: string | undefined,
): Promise<void> {
  if (!verifySignature(rawBody, signature)) {
    throw new ApiError(400, "Invalid webhook signature");
  }
  if (!eventId) {
    throw new ApiError(400, "Missing event id");
  }

  const alreadyProcessed = await prisma.webhookEvent.findUnique({ where: { eventId } });
  if (alreadyProcessed) {
    return;
  }

  const payload = JSON.parse(rawBody.toString("utf-8"));
  const eventType: string = payload.event;

  if (eventType === "payment.captured") {
    await handlePaymentCaptured(payload, eventId, eventType);
  } else if (eventType === "refund.processed") {
  await handleRefundProcessed(payload, eventId, eventType);
}else if (eventType === "payment.failed") {
    await handlePaymentFailed(payload, eventId, eventType);
  } else {
    await prisma.webhookEvent.create({ data: { eventId, eventType } });
  }
}

async function handlePaymentCaptured(payload: any, eventId: string, eventType: string) {
  const paymentEntity = payload.payload.payment.entity;
  const notes: RazorpayNotes = paymentEntity.notes;
  const razorpayOrderId: string = paymentEntity.order_id;
  const razorpayPaymentId: string = paymentEntity.id;
  const amountPaise: number = paymentEntity.amount;
  const amountRupees = amountPaise / 100;

  if (!notes?.roomId || !notes?.userId || !notes?.checkIn || !notes?.checkOut) {
    await prisma.webhookEvent.create({ data: { eventId, eventType } });
    throw new ApiError(422, "Payment notes missing required booking fields");
  }

  const checkIn = new Date(notes.checkIn);
  const checkOut = new Date(notes.checkOut);

  // Result flag so we know, after the transaction, whether to also fire the
  // real refund API call — that call must happen OUTSIDE the transaction,
  // since it's a network call to Razorpay and should never be allowed to
  // roll back a Postgres write that already succeeded.
  let needsRefund = false;
  let createdOrphanPaymentId: string | null = null;

  await prisma.$transaction(async (tx) => {
    await tx.webhookEvent.create({ data: { eventId, eventType } });

    const conflict = await tx.booking.findFirst({
      where: {
        roomId: notes.roomId,
        status: { not: "CANCELED" },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });

    if (conflict) {
      // The room was taken by someone else's faster payment while this one
      // was still processing. This payment is real and captured — it just
      // can't become a booking. Record it as an orphan, mark refund as
      // in-progress, and let the code after this transaction actually
      // trigger the refund.
      const orphanPayment = await tx.payment.create({
  data: {
    bookingId: null,
    holdId: notes.holdId,   // NEW
    razorpayOrderId,
    razorpayPaymentId,
    amount: amountRupees,
    status: "PAID",
    refundStatus: "PROCESSING",
    orphanReason: `Room ${notes.roomId} was booked by another user before this payment's webhook arrived.`,
  },
});
      needsRefund = true;
      createdOrphanPaymentId = orphanPayment.id;
      return;
    }

    const room = await tx.room.findUnique({ where: { id: notes.roomId }, select: { price: true } });
    if (!room) throw new ApiError(404, "Room not found during booking confirmation");

    const dayCount = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = dayCount * Number(room.price);

    const booking = await tx.booking.create({
      data: {
        roomId: notes.roomId,
        userId: notes.userId,
        checkIn,
        checkOut,
        totalPrice,
        guests: Number(notes.guests),
        status: "CONFIRMED",
      },
    });

    await tx.payment.create({
  data: {
    bookingId: booking.id,
    holdId: notes.holdId,  
    razorpayOrderId,
    razorpayPaymentId,
    amount: amountRupees,
    status: "PAID",
  },
    });
  });

  await releaseBookingHold(notes.roomId, checkIn, checkOut);

  if (needsRefund && createdOrphanPaymentId) {
    try {
      const refund = await issueRefund(razorpayPaymentId, amountRupees);
      await prisma.payment.update({
        where: { id: createdOrphanPaymentId },
        data: { refundStatus: "PROCESSING", razorpayRefundId: refund.id },
      });
      // Refund is now in motion on Razorpay's side — a separate
      // "refund.processed" webhook (built alongside the cancellation flow)
      // will later flip this to refundStatus: "COMPLETED".
    } catch (err) {
      // The refund API call itself failed — this is now a case that needs
      // a human, not silent code. Logging loudly rather than swallowing it,
      // since real money is stuck in an ambiguous state at this point.
      console.error(
        `CRITICAL: refund failed for orphan payment ${createdOrphanPaymentId} (razorpayPaymentId: ${razorpayPaymentId}). Manual intervention required.`,
        err,
      );
      await prisma.payment.update({
        where: { id: createdOrphanPaymentId },
        data: { refundStatus: "FAILED" },
      });
    }
  }
}

async function handlePaymentFailed(payload: any, eventId: string, eventType: string) {
  const paymentEntity = payload.payload.payment.entity;
  const notes: RazorpayNotes = paymentEntity.notes;

  await prisma.webhookEvent.create({ data: { eventId, eventType } });

  if (notes?.roomId && notes?.checkIn && notes?.checkOut) {
    await releaseBookingHold(notes.roomId, new Date(notes.checkIn), new Date(notes.checkOut));
  }
}

async function handleRefundProcessed(payload: any, eventId: string, eventType: string) {
  const refundEntity = payload.payload.refund.entity;
  const razorpayPaymentId: string = refundEntity.payment_id;

  await prisma.$transaction(async (tx) => {
    await tx.webhookEvent.create({ data: { eventId, eventType } });

    const payment = await tx.payment.findUnique({ where: { razorpayPaymentId } });
    if (!payment) return;

    await tx.payment.update({
      where: { id: payment.id },
      data: { refundStatus: "COMPLETED" },
    });
  });
}
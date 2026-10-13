import crypto from "crypto";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { releaseBookingHold } from "../booking/bookingHold";
import { issueRefund } from "./razorpayRefund";
import { sendEmail } from "../../utils/mail";
import {
  bookingConfirmedTemplate,
  refundCompletedTemplate,
  refundFailedTemplate,
  roomUnavailableTemplate,
} from "../../utils/emailTemplates";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

function verifySignature(
  rawBody: Buffer,
  signature: string | undefined,
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
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

  const alreadyProcessed = await prisma.webhookEvent.findUnique({
    where: { eventId },
  });
  if (alreadyProcessed) {
    return;
  }

  const payload = JSON.parse(rawBody.toString("utf-8"));
  const eventType: string = payload.event;

  if (eventType === "payment.captured") {
    await handlePaymentCaptured(payload, eventId, eventType);
  } else if (eventType === "refund.processed") {
    await handleRefundProcessed(payload, eventId, eventType);
  } else if (eventType === "refund.failed") {
    await handleRefundFailedWebhook(payload, eventId, eventType);
  } else if (eventType === "payment.failed") {
    await handlePaymentFailed(payload, eventId, eventType);
  } else {
    await prisma.webhookEvent.create({ data: { eventId, eventType } });
  }
}

async function handlePaymentCaptured(
  payload: any,
  eventId: string,
  eventType: string,
) {
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

  let needsRefund = false;
  let createdOrphanPaymentId: string | null = null;
  let orphanUserContact: { email: string; firstName: string } | null = null;

  let confirmedEmailData: {
    to: string;
    firstName: string;
    hotelName: string;
    roomName: string;
  } | null = null;

  let orphanUserEmail: { email: string; firstName: string } | null = null;

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
      const orphanPayment = await tx.payment.create({
        data: {
          bookingId: null,
          holdId: notes.holdId,
          userId: notes.userId,
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

      const orphanUser = await tx.user.findUnique({
        where: { id: notes.userId },
        select: { email: true, firstName: true },
      });
      if (orphanUser) {
        orphanUserContact = {
          email: orphanUser.email,
          firstName: orphanUser.firstName,
        };
        orphanUserEmail = {
          email: orphanUser.email,
          firstName: orphanUser.firstName,
        };
      }
      return;
    }

    const room = await tx.room.findUnique({
      where: { id: notes.roomId },
      select: { price: true, name: true, hotel: { select: { name: true } } },
    });
    if (!room)
      throw new ApiError(404, "Room not found during booking confirmation");

    const user = await tx.user.findUnique({
      where: { id: notes.userId },
      select: { email: true, firstName: true },
    });
    if (!user)
      throw new ApiError(404, "User not found during booking confirmation");

    const dayCount = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
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
        userId: notes.userId,
        razorpayOrderId,
        razorpayPaymentId,
        amount: amountRupees,
        status: "PAID",
      },
    });

    confirmedEmailData = {
      to: user.email,
      firstName: user.firstName,
      hotelName: room.hotel.name,
      roomName: room.name,
    };
  });

  await releaseBookingHold(notes.roomId, checkIn, checkOut);

  if (confirmedEmailData) {
    const { to, firstName, hotelName, roomName } = confirmedEmailData;
    sendEmail(
      to,
      "Booking Confirmed — StayEasy",
      bookingConfirmedTemplate({
        firstName,
        hotelName,
        roomName,
        checkIn,
        checkOut,
        guests: Number(notes.guests),
        totalPrice: amountRupees,
      }),
    ).catch((err) => {
      console.error(`Failed to send booking confirmed email to ${to}:`, err);
    });
  }

  if (orphanUserEmail) {
    const { email, firstName } = orphanUserEmail;
    sendEmail(
      email,
      "Room No Longer Available — StayEasy",
      roomUnavailableTemplate({
        firstName,
        bookingId: createdOrphanPaymentId!,
        totalPrice: amountRupees,
      }),
    ).catch((err) => {
      console.error(`Failed to send room-unavailable email to ${email}:`, err);
    });
  }

  if (needsRefund && createdOrphanPaymentId) {
    try {
      const refund = await issueRefund(razorpayPaymentId, amountRupees);
      await prisma.payment.update({
        where: { id: createdOrphanPaymentId },
        data: { refundStatus: "PROCESSING", razorpayRefundId: refund.id },
      });
    } catch (err) {
      console.error(
        `CRITICAL: refund failed for orphan payment ${createdOrphanPaymentId} (razorpayPaymentId: ${razorpayPaymentId}). Manual intervention required.`,
        err,
      );
      await prisma.payment.update({
        where: { id: createdOrphanPaymentId },
        data: { refundStatus: "FAILED" },
      });

      const contact: any = orphanUserContact;
      if (contact) {
        sendEmail(
          contact.email,
          "Refund Issue — StayEasy",
          refundFailedTemplate({
            firstName: contact.firstName,
            bookingId: createdOrphanPaymentId,
            totalPrice: amountRupees,
          }),
        ).catch((emailErr) => {
          console.error(
            `Failed to send refund-failed email to ${contact.email}:`,
            emailErr,
          );
        });
      }
    }
  }
}

async function handlePaymentFailed(
  payload: any,
  eventId: string,
  eventType: string,
) {
  const paymentEntity = payload.payload.payment.entity;
  const notes: RazorpayNotes = paymentEntity.notes;

  await prisma.webhookEvent.create({ data: { eventId, eventType } });

  if (notes?.roomId && notes?.checkIn && notes?.checkOut) {
    await releaseBookingHold(
      notes.roomId,
      new Date(notes.checkIn),
      new Date(notes.checkOut),
    );
  }
}

async function handleRefundProcessed(
  payload: any,
  eventId: string,
  eventType: string,
) {
  const refundEntity = payload.payload.refund.entity;
  const razorpayPaymentId: string = refundEntity.payment_id;

  let refundedUserContact: { email: string; firstName: string } | null = null;
  let refundedAmount: number | null = null;
  let refundedPaymentId: string | null = null;

  await prisma.$transaction(async (tx) => {
    await tx.webhookEvent.create({ data: { eventId, eventType } });

    const payment = await tx.payment.findUnique({
      where: { razorpayPaymentId },
    });
    if (!payment) return;

    await tx.payment.update({
      where: { id: payment.id },
      data: { refundStatus: "COMPLETED" },
    });

    if (payment.userId) {
      const user = await tx.user.findUnique({
        where: { id: payment.userId },
        select: { email: true, firstName: true },
      });
      if (user) {
        refundedUserContact = { email: user.email, firstName: user.firstName };
        refundedAmount = Number(payment.amount);
        refundedPaymentId = payment.id;
      }
    }
  });

  if (refundedUserContact && refundedAmount !== null && refundedPaymentId) {
    const { email, firstName } = refundedUserContact;
    sendEmail(
      email,
      "Refund Completed — StayEasy",
      refundCompletedTemplate({
        firstName,
        totalPrice: refundedAmount,
      }),
    ).catch((err) => {
      console.error(`Failed to send refund-completed email to ${email}:`, err);
    });
  }
}

async function handleRefundFailedWebhook(
  payload: any,
  eventId: string,
  eventType: string,
) {
  const refundEntity = payload.payload.refund.entity;
  const razorpayPaymentId: string = refundEntity.payment_id;

  let failedUserContact: { email: string; firstName: string } | null = null;
  let failedAmount: number | null = null;
  let failedPaymentId: string | null = null;

  await prisma.$transaction(async (tx) => {
    await tx.webhookEvent.create({ data: { eventId, eventType } });

    const payment = await tx.payment.findUnique({
      where: { razorpayPaymentId },
    });
    if (!payment) return;

    if (payment.refundStatus === "COMPLETED") return;

    await tx.payment.update({
      where: { id: payment.id },
      data: { refundStatus: "FAILED" },
    });

    if (payment.userId) {
      const user = await tx.user.findUnique({
        where: { id: payment.userId },
        select: { email: true, firstName: true },
      });
      if (user) {
        failedUserContact = { email: user.email, firstName: user.firstName };
        failedAmount = Number(payment.amount);
        failedPaymentId = payment.id;
      }
    }
  });

  if (failedUserContact && failedAmount !== null && failedPaymentId) {
    const { email, firstName } = failedUserContact;
    console.error(
      `CRITICAL: refund failed asynchronously (via webhook) for payment ${failedPaymentId} (razorpayPaymentId: ${razorpayPaymentId}). Manual intervention required.`,
    );
    sendEmail(
      email,
      "Refund Issue — StayEasy",
      refundFailedTemplate({
        firstName,
        bookingId: failedPaymentId,
        totalPrice: failedAmount,
      }),
    ).catch((err) => {
      console.error(`Failed to send refund-failed email to ${email}:`, err);
    });
  }
}

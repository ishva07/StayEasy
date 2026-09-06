import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { processRazorpayWebhook } from "./payment.service";

export const razorpayWebhookController = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string | undefined;
    const eventId = req.headers["x-razorpay-event-id"] as string | undefined;

    await processRazorpayWebhook(req.body as Buffer, signature, eventId);
    res.status(200).json({ received: true });
  },
);
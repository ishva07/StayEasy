import razorpayClient from "../../config/razorpay";

export async function issueRefund(razorpayPaymentId: string, amountRupees: number) {
  return razorpayClient.payments.refund(razorpayPaymentId, {
    amount: Math.round(amountRupees * 100),
    speed: "normal",
  });
}
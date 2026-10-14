interface BookingEmailData {
  firstName: string;
  hotelName: string;
  roomName: string;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  totalPrice: number | string;
}

interface RefundFailedEmailData {
  firstName: string;
  hotelName?: string;
  bookingId: string;
  totalPrice: number | string;
}

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const wrapper = (title: string, bodyHtml: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h2 style="margin-bottom: 16px;">${title}</h2>
    ${bodyHtml}
    <p style="margin-top: 24px; font-size: 13px; color: #666;">
      — Team StayEasy
    </p>
  </div>
`;

export const bookingConfirmedTemplate = (data: BookingEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Your booking is confirmed! Here are the details:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #666;">Hotel</td><td style="padding: 6px 0;">${data.hotelName}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Room</td><td style="padding: 6px 0;">${data.roomName}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Check-in</td><td style="padding: 6px 0;">${formatDate(data.checkIn)}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Check-out</td><td style="padding: 6px 0;">${formatDate(data.checkOut)}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Guests</td><td style="padding: 6px 0;">${data.guests}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Total Paid</td><td style="padding: 6px 0;">₹${data.totalPrice}</td></tr>
    </table>
    <p>We look forward to hosting you!</p>
  `;
  return wrapper("Booking Confirmed", body);
};

export const bookingCancelledTemplate = (data: BookingEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Your booking has been cancelled as requested. Here's a summary:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 6px 0; color: #666;">Hotel</td><td style="padding: 6px 0;">${data.hotelName}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Room</td><td style="padding: 6px 0;">${data.roomName}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Check-in</td><td style="padding: 6px 0;">${formatDate(data.checkIn)}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Check-out</td><td style="padding: 6px 0;">${formatDate(data.checkOut)}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Refund Amount</td><td style="padding: 6px 0;">₹${data.totalPrice}</td></tr>
    </table>
    <p>Your refund is being processed and should reflect in your original payment method within a few business days.</p>
  `;
  return wrapper("Booking Cancelled", body);
};

interface RoomUnavailableEmailData {
  firstName: string;
  totalPrice: number | string;
}

export const roomUnavailableRefundInitiatedTemplate = (data: RoomUnavailableEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Your payment of <strong>₹${data.totalPrice}</strong> was successful, but unfortunately the room you selected was booked by another guest just before your payment was confirmed.</p>
    <p>Don't worry — we're processing a full refund of ₹${data.totalPrice} to your original payment method right away. This usually reflects within a few business days.</p>
    <p>We're sorry for the inconvenience. Please feel free to search for another available room.</p>
  `;
  return wrapper("Room No Longer Available — Refund Initiated", body);
};

interface RoomUnavailableEmailData {
  firstName: string;
  totalPrice: number | string;
  bookingId: string;
}

export const roomUnavailableTemplate = (data: RoomUnavailableEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Your payment of <strong>₹${data.totalPrice}</strong> was successful, but unfortunately the room you selected was booked by another guest just moments before your payment was confirmed.</p>
    <p>Don't worry — your booking was not created, and we're processing a full refund of your payment right away. It should reflect in your original payment method within a few business days.</p>
    <p style="color: #666; font-size: 13px;">Reference ID: ${data.bookingId}</p>
    <p>We're sorry for the inconvenience, and we'd love for you to try booking again.</p>
  `;
  return wrapper("Room No Longer Available — Refund In Progress", body);
};

interface PaymentRefundInitiatedEmailData {
  firstName: string;
  totalPrice: number | string;
  referenceId: string;
  reason: string;
}

export const paymentRefundInitiatedTemplate = (
  data: PaymentRefundInitiatedEmailData,
): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Your payment of <strong>₹${data.totalPrice}</strong> was successful, but we could not complete the booking because ${data.reason}.</p>
    <p>We're processing a full refund to your original payment method. It should reflect within a few business days.</p>
    <p style="color: #666; font-size: 13px;">Reference ID: ${data.referenceId}</p>
    <p>We're sorry for the inconvenience.</p>
  `;
  return wrapper("Payment Refund Initiated — StayEasy", body);
};

interface RefundCompletedEmailData {
  firstName: string;
  totalPrice: number | string;
}

export const refundCompletedTemplate = (data: RefundCompletedEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>Good news — your refund of <strong>₹${data.totalPrice}</strong> has been successfully processed and sent to your original payment method.</p>
    <p>It may take a few business days to reflect in your account, depending on your bank.</p>
  `;
  return wrapper("Refund Completed", body);
};

export const refundFailedTemplate = (data: RefundFailedEmailData): string => {
  const body = `
    <p>Hi ${data.firstName},</p>
    <p>We attempted to process your refund of <strong>₹${data.totalPrice}</strong> ${
      data.hotelName ? `for your booking at <strong>${data.hotelName}</strong>` : ""
    }, but it did not go through successfully.</p>
    <p>Don't worry — our team has been notified and will manually resolve this for you shortly. No further action is needed on your end.</p>
    <p style="color: #666; font-size: 13px;">Reference ID: ${data.bookingId}</p>
    <p>If you don't hear from us within 2 business days, please reach out to our support team.</p>
  `;
  return wrapper("Refund Issue — We're On It", body);
};
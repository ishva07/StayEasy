import nodemailer from "nodemailer";
import env from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("Nodemailer transporter verification failed:", err);
  } else {
    console.log("Nodemailer transporter ready to send emails.");
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
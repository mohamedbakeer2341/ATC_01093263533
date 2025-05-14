import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Areeb" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `Click <a href="${verificationUrl}">here</a> to verify your email.`,
  });
};

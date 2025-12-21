import nodemailer from "nodemailer";

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "Gifty <no-reply@gifty.com>",
    to,
    subject: "Verify your email - Gifty",
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`,
  });
};

export default sendEmail;

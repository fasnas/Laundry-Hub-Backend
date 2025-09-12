import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "laundyhub001@gmail.com",
      pass: "bldnauamhmtitsxq",
    },
  });

  const mailOptions = {
    from: "laundyhub001@gmail.com",
    to: email,
    subject: "Verify Your Email - OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

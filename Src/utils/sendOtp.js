import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "laundyhub001@gmail.com",
      pass: "bldnauamhmtitsxq",
    },
  });

  // const mailOptions = {
  //   from: "laundyhub001@gmail.com",
  //   to: email,
  //   subject: "Verify Your Email - OTP",
  //   text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  // };


  const mailOptions = {
  from: "laundyhub001@gmail.com",
  to: email,
  subject: "Verify Your Email – OTP",
  html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#ffffff;">
    <h2 style="color:#4caf50; text-align:center;">Laundry Hub</h2>
    <p style="font-size:16px; color:#333;">
      Use the following One-Time Password (OTP) to verify your email address. This code will expire in <strong>1 minutes</strong>.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <span style="
        display:inline-block;
        background:#4caf50;
        color:#fff;
        padding:14px 28px;
        font-size:24px;
        letter-spacing:4px;
        border-radius:6px;
        font-weight:bold;
      ">
        ${otp}
      </span>
    </div>

    <p style="font-size:14px; color:#555;">
      If you didn’t request this verification, you can safely ignore this email.
    </p>

    <p style="font-size:14px; color:#999; text-align:center; margin-top:30px;">
      &copy; ${new Date().getFullYear()} Laundry Hub. All rights reserved.
    </p>
  </div>
  `,
};


  await transporter.sendMail(mailOptions);
};

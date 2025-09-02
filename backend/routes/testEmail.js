// testEmail.js
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

const sendTestEmail = async (to = process.env.EMAIL_USER) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Blue-Nile booker",
    text: "This is a test email sent from Nodemailer 🚀",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

export default sendTestEmail;

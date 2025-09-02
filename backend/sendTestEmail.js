// sendTestEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // loads .env

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // must be the Gmail account
      to: process.env.ADMIN_EMAIL, // recipient (can be same or different)
      subject: "✅ Gmail Test Email",
      text: "Hello, this is a test email from Nodemailer using App Password!",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

sendTestEmail();

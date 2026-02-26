import { emailBookNowBody, sendEmail } from "../lib/mailer.js";

const createBooking = async (req, res) => {
  const data = req.body;
  try {
    await sendEmail({
      email: process.env.EMAIL_TO,
      subject: `📅 Новий запис: ${data.service}`,
      html: emailBookNowBody(data.name, data.service, data.comment, data.phone, data.email),
    });
    res.json({ message: "Booking request sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send booking request." });
  }
};

export { createBooking };
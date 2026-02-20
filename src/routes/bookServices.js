const express = require("express");
const router = express.Router();
const sendEmail = require("../lib/mailer");

router.post("/book-service", async (req, res) => {
  const data = req.body;

  try {
    await sendEmail(data);
    res.json({ message: "Booking request sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send booking request." });
  }
});

module.exports = router;

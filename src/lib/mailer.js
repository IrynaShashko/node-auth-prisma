// const nodemailer = require("nodemailer");

// // Налаштування для тестів (Ethereal)
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "walter.ebert@ethereal.email",
//     pass: "dy3Z4naDCnvmtBcUPE",
//   },
// });

// module.exports = transporter;

const nodemailer = require("nodemailer");

// Використовуємо транспорт для SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // Це слово пишемо буквально: "apikey"
    pass: process.env.SENDGRID_API_KEY, // Твій ключ з .env
  },
});

module.exports = transporter;
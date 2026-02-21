import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailVerificationBody = (verifyUrl) => {
  return `
    <div style="font-family: Arial; text-align: center;">
      <h1>Підтвердження реєстрації</h1>
      <p>Дякуємо за реєстрацію! Будь ласка, натисніть на кнопку нижче, щоб активувати ваш аккаунт:</p>
      <a href="${verifyUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Підтвердити пошту</a>
      <p>Це посилання дійсне протягом 24 годин.</p>
    </div>
  `;
};

const emailBookNowBody = (name, service, comment, phone) => {
  const cleanPhone = phone.replace(/\D/g, "");

  return `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eeeeee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #007586; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">Нова заявка з сайту</h2>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="margin: 10px 0;"><strong>Клієнт:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Послуга:</strong> ${service}</p>
            <p style="margin: 10px 0;"><strong>Коментар:</strong> ${comment}</p>
            <p style="margin: 10px 0;"><strong>Телефон:</strong> 
              <a href="tel:${cleanPhone}" style="color: #007586; text-decoration: none; font-weight: bold;">${cleanPhone}</a>
            </p>
          </div>
        </div>
      `;
};

const emailContactBody = (resetUrl) => {
  return `
        <h1>Вітаємо!</h1>
        <p>Ви отримали цей лист, бо зробили запит на зміну пароля.</p>
        <a href="${resetUrl}">Натисніть тут, щоб змінити пароль</a>
        <p>Це посилання дійсне 1 годину.</p>
      `;
};

const sendEmail = async ({ email, subject, html }) => {
  const emailData = {
    to: email,
    from: process.env.EMAIL_FROM,
    replyTo: process.env.EMAIL_FROM,
    subject: subject,
    html: html,
  };

  return sgMail.send(emailData);
};

export { emailVerificationBody, emailBookNowBody, emailContactBody, sendEmail };

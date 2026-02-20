const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const senderEmail = process.env.EMAIL_FROM;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailBody = (name, service, comment, phone) => {
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

const sendEmail = async ({ email, name, service, comment, phone }) => {
  const emailData = {
    to: email,
    from: senderEmail,
    replyTo: "irishkashashko@gmail.com",
    subject: `📅 New Booking: ${service} - ${name}`,
    html: emailBody(name, service, comment, phone),
  };
  return sgMail
    .send(emailData)
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

module.exports = sendEmail;

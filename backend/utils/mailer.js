const nodemailer = require('nodemailer');
async function sendMail(to, subject, html, attachments=[]) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password'
    }
  });
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@example.com', to, subject, html, attachments });
  return info;
}
module.exports = { sendMail };

// cron/reminders.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const User = require("../models/User");

function daysLeft(date) {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000*60*60*24));
}

async function sendMail(to, subject, text) {
  if (!process.env.SMTP_HOST) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@homeservices.com",
    to, subject, text
  });
}

// Daily at 09:00
cron.schedule("0 9 * * *", async () => {
  try {
    const users = await User.find({});
    for (const u of users) {
      if (!u.email) continue;
      // License/Insurance expiry reminders
      const vd = u.verificationDocs || {};
      const licDays = daysLeft(vd.license?.expiry);
      const insDays = daysLeft(vd.insurance?.expiry);

      if (licDays !== null && [30,7,1].includes(licDays)) {
        await sendMail(u.email, "License Expiry Reminder",
          `Your license expires in ${licDays} day(s). Please update.`);
      }
      if (insDays !== null && [30,7,1].includes(insDays)) {
        await sendMail(u.email, "Insurance Expiry Reminder",
          `Your insurance expires in ${insDays} day(s). Please update.`);
      }

      // Verified Pro expiry
      const vpDays = daysLeft(u.verifiedProExpiry);
      if (vpDays !== null && [30,7,1].includes(vpDays)) {
        await sendMail(u.email, "Verified Pro Renewal Reminder",
          `Your Verified Pro expires in ${vpDays} day(s). Renew to keep your badge.`);
      }
    }
    console.log("Reminder cron executed");
  } catch (e) {
    console.error("Reminder cron error", e);
  }
});

module.exports = {}; // just to require() it

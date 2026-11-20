const nodemailer = require('nodemailer');

function createMailer({ user, pass }) {
  if (!user || !pass) {
    return { isConfigured: false, async sendMail() { throw new Error('Email service not configured'); } };
  }
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  return {
    isConfigured: true,
    sendMail(options) {
      return transporter.sendMail({ from: user, ...options });
    },
  };
}

module.exports = { createMailer };


// Nodemailer SMTP Mailing Service
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const smtpConfig = {
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

let transporter = null;

if (smtpConfig.host && smtpConfig.auth.user) {
  transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass
    },
    tls: {
      rejectUnauthorized: false // Avoid SSL handshake blockages on custom SMTP relays
    }
  });
  
  // Verify configuration connection on launch
  transporter.verify((error) => {
    if (error) {
      logger.error('SMTP server verification failed. Please check credentials in .env file.', error);
    } else {
      logger.info(`SMTP Server connection verified successfully: ${smtpConfig.host}:${smtpConfig.port}`);
    }
  });
} else {
  logger.warn('SMTP Credentials missing or incomplete. Email routing will operate in Simulated local logs mode.');
}

async function sendMail({ from, to, subject, html }) {
  if (transporter) {
    logger.info(`Dispatching real SMTP email. Sender: ${from} | Recipient: ${to}`);
    return await transporter.sendMail({
      from,
      to,
      subject,
      html
    });
  } else {
    logger.info(`[SIMULATION LOG] Email Dispatched to local console (SMTP Server offline):
      -----------------------------------------
      From: ${from}
      To: ${to}
      Subject: ${subject}
      -----------------------------------------`);
    // Simulate brief network lag
    await new Promise(resolve => setTimeout(resolve, 500));
    return { messageId: 'mock-message-id-' + Math.floor(Math.random() * 1000000) };
  }
}

module.exports = {
  sendMail
};

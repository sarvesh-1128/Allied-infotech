// Nodemailer SMTP Mailing Service — configured for Gmail with App Password
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true'; // true only for port 465

let transporter = null;

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false  // Avoid SSL issues on firewalled networks
    }
  });

  // Verify the connection on startup
  transporter.verify((error) => {
    if (error) {
      logger.error(`SMTP verification failed (${smtpHost}:${smtpPort}). Check .env credentials.`, error);
    } else {
      logger.info(`SMTP ready: ${smtpHost}:${smtpPort} — authenticated as ${smtpUser}`);
    }
  });
} else {
  logger.warn(
    'SMTP_USER or SMTP_PASS missing in .env. ' +
    'Running in SIMULATION mode — emails will be logged to console only.\n' +
    'To enable real delivery:\n' +
    '  1. Open .env\n' +
    '  2. Set SMTP_USER=sxrvxsh07@gmail.com\n' +
    '  3. Set SMTP_PASS=<your 16-character Gmail App Password>\n' +
    '  4. Restart the server: node server.js'
  );
}

/**
 * Send an email via the configured SMTP transporter.
 * Falls back to console simulation if SMTP is not configured.
 *
 * @param {object} mailOptions - { from, to, subject, html }
 */
async function sendMail({ from, to, subject, html }) {
  if (transporter) {
    logger.info(`Dispatching email → To: ${to} | Subject: "${subject}"`);
    const info = await transporter.sendMail({ from, to, subject, html });
    logger.info(`Email delivered. Message ID: ${info.messageId}`);
    return info;
  } else {
    // Simulation mode — log full details for debugging
    logger.info(`[SIMULATION] Email NOT sent (SMTP offline). Would have dispatched:\n` +
      `  From   : ${from}\n` +
      `  To     : ${to}\n` +
      `  Subject: ${subject}\n` +
      `  ─────────────────────────────────────────────────────────\n` +
      `  Configure SMTP_PASS in .env to enable real email delivery.`
    );
    await new Promise(resolve => setTimeout(resolve, 400));
    return { messageId: 'sim-' + Date.now() };
  }
}

module.exports = { sendMail };

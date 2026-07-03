// Contact and RFQ Submission Controller
const mailService = require('../services/mailService');
const logger = require('../utils/logger');

// Format HTML email body with premium industrial look
function formatEmailHtml(data, timestamp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #F8FAFC; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0059B3; padding: 25px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 30px; }
        .field-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .field-table th, .field-table td { padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: left; vertical-align: top; }
        .field-table th { width: 35%; color: #64748B; font-weight: 600; font-size: 13px; text-transform: uppercase; }
        .field-table td { color: #1E293B; font-size: 14px; }
        .message-box { background-color: #F1F5F9; border-left: 4px solid #0059B3; padding: 15px; border-radius: 0 4px 4px 0; margin-top: 15px; }
        .message-title { font-weight: 600; font-size: 13px; color: #475569; margin-bottom: 6px; text-transform: uppercase; }
        .message-text { font-size: 14px; color: #334155; white-space: pre-wrap; margin: 0; }
        .footer { background-color: #0B1329; color: #94A3B8; text-align: center; padding: 15px; font-size: 11px; }
        .footer a { color: #38BDF8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ALLIED-ICONIC PVT. LTD.</h1>
          <div style="font-size: 12px; margin-top: 4px; color: #93C5FD;">Allied Infotech Engineering Desk Enquiry</div>
        </div>
        <div class="content">
          <table class="field-table">
            <tr>
              <th>Sender Name</th>
              <td>${data.name}</td>
            </tr>
            <tr>
              <th>Company Name</th>
              <td>${data.company || 'Not Specified'}</td>
            </tr>
            <tr>
              <th>Business Email</th>
              <td><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <th>Contact Phone</th>
              <td>${data.phone}</td>
            </tr>
            <tr>
              <th>Subject</th>
              <td><strong>${data.subject}</strong></td>
            </tr>
            <tr>
              <th>Timestamp</th>
              <td>${timestamp}</td>
            </tr>
          </table>

          <div class="message-box">
            <div class="message-title">Enquiry details / Message</div>
            <pre class="message-text">${data.message}</pre>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Allied-Iconic Pvt. Ltd. (Allied Infotech Division). All rights reserved.<br>
          Registered address: No.26, Venkateshwara Street, Athipet, Chennai - 600058
        </div>
      </div>
    </body>
    </html>
  `;
}

async function handleContactForm(req, res) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST';
  const { name, company, email, subject, phone, message, hp_field } = req.body;

  // 1. Double Honeypot protection
  if (hp_field) {
    logger.warn('Spam submission detected via honeypot input field. Request dropped silently.', { ip: req.ip });
    // Return standard success to trick the spam bot
    return res.status(200).json({
      success: true,
      message: 'Enquiry received successfully!'
    });
  }

  try {
    logger.info(`Formatting and sending contact email for: ${name} (${company})`);

    const htmlBody = formatEmailHtml({ name, company, email, subject, phone, message }, timestamp);
    const mailReceiver = process.env.CONTACT_RECEIVER || 'info@allied-iconic.com';
    const mailSender = process.env.SMTP_SENDER || `enquiries@allied-iconic.com`;

    const info = await mailService.sendMail({
      from: `"Allied Web Desk" <${mailSender}>`,
      to: mailReceiver,
      subject: `[Web Enquiry] ${subject} - ${name}`,
      html: htmlBody
    });

    logger.info('Contact form email successfully dispatched', { messageId: info.messageId });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
    });
  } catch (error) {
    logger.error('Failed to send contact enquiry email', error);
    return res.status(500).json({
      success: false,
      message: 'Internal mail server error. Please try again later or contact us directly via email.'
    });
  }
}

module.exports = {
  handleContactForm
};

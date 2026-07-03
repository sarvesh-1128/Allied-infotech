// Contact and RFQ Submission Controller
const mailService = require('../services/mailService');
const logger = require('../utils/logger');

const RECEIVER = process.env.CONTACT_RECEIVER || 'sxrvxsh07@gmail.com';
const SENDER   = process.env.SMTP_SENDER      || 'sxrvxsh07@gmail.com';

// ─── HTML Email Template ───────────────────────────────────────────────────────
function formatContactEmailHtml(data, timestamp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #F8FAFC; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: #0059B3; padding: 24px; text-align: center; color: #fff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .header p  { margin: 4px 0 0; font-size: 12px; color: #93C5FD; }
        .content   { padding: 28px 30px; }
        table      { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td     { padding: 11px 12px; border-bottom: 1px solid #E2E8F0; text-align: left; vertical-align: top; }
        th         { width: 36%; color: #64748B; font-weight: 600; font-size: 12px; text-transform: uppercase; }
        td         { color: #1E293B; font-size: 14px; }
        td a       { color: #0059B3; text-decoration: none; }
        .msg-box   { background: #F1F5F9; border-left: 4px solid #0059B3; padding: 14px 16px; border-radius: 0 4px 4px 0; }
        .msg-title { font-weight: 600; font-size: 12px; color: #475569; margin-bottom: 6px; text-transform: uppercase; }
        .msg-text  { font-size: 14px; color: #334155; white-space: pre-wrap; margin: 0; }
        .footer    { background: #0B1329; color: #94A3B8; text-align: center; padding: 14px; font-size: 11px; }
        .footer a  { color: #38BDF8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ALLIED-ICONIC PVT. LTD.</h1>
          <p>New Web Enquiry — Allied Infotech Engineering Desk</p>
        </div>
        <div class="content">
          <table>
            <tr><th>Sender Name</th>  <td>${data.name}</td></tr>
            <tr><th>Company</th>      <td>${data.company || '—'}</td></tr>
            <tr><th>Email</th>        <td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><th>Phone</th>        <td>${data.phone}</td></tr>
            <tr><th>Subject</th>      <td><strong>${data.subject}</strong></td></tr>
            <tr><th>Received at</th>  <td>${timestamp}</td></tr>
          </table>
          <div class="msg-box">
            <div class="msg-title">Enquiry / Message</div>
            <pre class="msg-text">${data.message}</pre>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Allied-Iconic Pvt. Ltd. &bull; No.26, Venkateshwara Street, Athipet, Chennai&nbsp;600058
        </div>
      </div>
    </body>
    </html>
  `;
}

function formatRfqEmailHtml(data, timestamp) {
  const specs = [
    ['Category',        data.category],
    ['Tonnage',         data.tonnage],
    ['Polymer Clarity', data.polymerClarity],
    ['Part Weight',     data.partWeight],
    ['Feeding Type',    data.feedingType],
    ['Mould Base Qty',  data.mouldBaseQty],
    ['Runner Type',     data.runnerType],
    ['Warranty',        data.warranty],
    ['Delivery Terms',  data.deliveryTerms],
  ].map(([k, v]) => `<tr><th>${k}</th><td>${v || '—'}</td></tr>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #F8FAFC; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header  { background: #0059B3; padding: 24px; text-align: center; color: #fff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p  { margin: 4px 0 0; font-size: 12px; color: #93C5FD; }
        .content { padding: 28px 30px; }
        .section-title { font-size: 13px; font-weight: 700; color: #0059B3; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
        table    { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td   { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; text-align: left; vertical-align: top; }
        th       { width: 36%; color: #64748B; font-weight: 600; font-size: 12px; text-transform: uppercase; }
        td       { color: #1E293B; font-size: 14px; }
        td a     { color: #0059B3; text-decoration: none; }
        .msg-box { background: #F1F5F9; border-left: 4px solid #0059B3; padding: 12px 16px; border-radius: 0 4px 4px 0; }
        .msg-text { font-size: 14px; color: #334155; white-space: pre-wrap; margin: 0; }
        .footer  { background: #0B1329; color: #94A3B8; text-align: center; padding: 14px; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ALLIED-ICONIC PVT. LTD.</h1>
          <p>New RFQ Configuration — ${data.category || 'General Enquiry'}</p>
        </div>
        <div class="content">
          <div class="section-title">Contact Details</div>
          <table>
            <tr><th>Name</th>     <td>${data.name}</td></tr>
            <tr><th>Company</th>  <td>${data.company || '—'}</td></tr>
            <tr><th>Email</th>    <td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><th>Phone</th>    <td>${data.phone}</td></tr>
            <tr><th>Received</th> <td>${timestamp}</td></tr>
          </table>

          <div class="section-title">RFQ Specifications</div>
          <table>${specs}</table>

          ${data.message ? `
          <div class="section-title">Additional Notes</div>
          <div class="msg-box">
            <pre class="msg-text">${data.message}</pre>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Allied-Iconic Pvt. Ltd. &bull; No.26, Venkateshwara Street, Athipet, Chennai&nbsp;600058
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Contact Form Handler ──────────────────────────────────────────────────────
async function handleContactForm(req, res) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  const { name, company, email, subject, phone, message, hp_field } = req.body;

  // Honeypot check — silently discard spam
  if (hp_field) {
    logger.warn('Spam blocked via honeypot.', { ip: req.ip });
    return res.status(200).json({ success: true, message: 'Enquiry received successfully!' });
  }

  try {
    logger.info(`Contact form submission: ${name} <${email}>`);

    const html = formatContactEmailHtml({ name, company, email, subject, phone, message }, timestamp);

    await mailService.sendMail({
      from: `"Allied Web Desk" <${SENDER}>`,
      to: RECEIVER,
      subject: `[Web Enquiry] ${subject} — ${name}`,
      html
    });

    logger.info('Contact email dispatched successfully.');
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent. Our team will respond within 24 business hours.'
    });

  } catch (error) {
    logger.error('Failed to dispatch contact email:', error);
    return res.status(500).json({
      success: false,
      message: 'Mail server error. Please try again or email us directly at sxrvxsh07@gmail.com.'
    });
  }
}

// ─── RFQ Form Handler ──────────────────────────────────────────────────────────
async function handleRfqForm(req, res) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  const data = req.body;

  if (data.hp_field) {
    return res.status(200).json({ success: true, message: 'RFQ received!' });
  }

  try {
    logger.info(`RFQ submission: ${data.name} <${data.email}> — ${data.category}`);

    const html = formatRfqEmailHtml(data, timestamp);

    await mailService.sendMail({
      from: `"Allied RFQ Desk" <${SENDER}>`,
      to: RECEIVER,
      subject: `[RFQ] ${data.category || 'Configuration Request'} — ${data.name}`,
      html
    });

    logger.info('RFQ email dispatched successfully.');
    const refId = '#RFQ-' + Math.floor(100000 + Math.random() * 900000);
    return res.status(200).json({
      success: true,
      message: `Thank you, ${data.name}! Your RFQ for ${data.category} has been received. Reference: ${refId}`
    });

  } catch (error) {
    logger.error('Failed to dispatch RFQ email:', error);
    return res.status(500).json({
      success: false,
      message: 'Mail server error. Please contact us directly at sxrvxsh07@gmail.com.'
    });
  }
}

module.exports = { handleContactForm, handleRfqForm };

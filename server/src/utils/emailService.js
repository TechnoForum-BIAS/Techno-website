const nodemailer = require('nodemailer');
require('dotenv').config();

const BREVO_HOST = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
const BREVO_PORT = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
const BREVO_USER = process.env.BREVO_SMTP_USER;
const BREVO_KEY = process.env.BREVO_SMTP_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Technoforum BIAS <noreply@technoforum.bias.ac.in>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize transporter if Brevo credentials are provided
let transporter = null;
const isConfigured = BREVO_USER && BREVO_KEY && !BREVO_USER.includes('your-brevo');

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port: BREVO_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: BREVO_USER,
      pass: BREVO_KEY,
    },
  });
  console.log('📧 Brevo SMTP Transporter initialized successfully.');
} else {
  console.warn('⚠️ Brevo SMTP credentials not configured. Email OTPs will be displayed in server logs for local development.');
}

/**
 * Send email helper (Brevo or Console Mock Fallback)
 */
const sendMail = async ({ to, subject, html, text }) => {
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Brevo SMTP] Email sent to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Brevo SMTP Error]:', err.message);
      // Fall through to console logging on error so development doesn't break
    }
  }

  // Fallback to console for intern testing without Brevo account
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log(`║ 📨 [EMAIL DISPATCHED] To: ${to}`);
  console.log(`║ 📌 Subject: ${subject}`);
  console.log(`║ 📄 Content Summary: ${text || 'Check HTML'}`);
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  return { success: true, fallback: true };
};

/**
 * Send Email Verification with OTP & Direct Link
 */
const sendVerificationEmail = async (email, name, otpCode, verificationToken) => {
  const verifyLink = `${CLIENT_URL}/login?tab=verify&email=${encodeURIComponent(email)}&code=${otpCode}`;
  const subject = `[Technoforum] Verify Your Email Address - OTP: ${otpCode}`;
  const text = `Hello ${name},\nYour Technoforum email verification code is: ${otpCode}\nOr click: ${verifyLink}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #070B19; color: #F8FAFC; margin: 0; padding: 20px; }
        .card { background-color: #0D1527; border: 1px solid #1E293B; border-radius: 16px; max-width: 520px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #1E293B; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #38BDF8; letter-spacing: 2px; }
        .sub { font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; }
        .otp-box { background-color: #070B19; border: 2px dashed #38BDF8; border-radius: 12px; text-align: center; padding: 18px; margin: 24px 0; }
        .otp { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38BDF8; font-family: monospace; }
        .btn { display: block; width: 220px; margin: 20px auto 0; text-align: center; background-color: #2563EB; color: #ffffff !important; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 10px; font-size: 14px; }
        .footer { font-size: 11px; color: #64748B; text-align: center; margin-top: 28px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">TECHNOFORUM</div>
          <div class="sub">Birla Institute of Applied Sciences</div>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
          Thank you for creating your Technoforum account. Please use the 6-digit verification code below to confirm your email:
        </p>
        <div class="otp-box">
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px; text-transform: uppercase;">One-Time Verification Code</div>
          <div class="otp">${otpCode}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">Expires in 15 minutes</div>
        </div>
        <p style="text-align: center; font-size: 13px; color: #94A3B8;">Or verify instantly by clicking below:</p>
        <a href="${verifyLink}" class="btn">Verify Account Now</a>
        <div class="footer">
          If you did not request this account, please ignore this email.<br>
          Technoforum Technical Society • BIAS Bhimtal
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({ to: email, subject, html, text });
};

/**
 * Send Password Reset Email with OTP & Direct Link
 */
const sendPasswordResetEmail = async (email, name, resetCode, resetToken) => {
  const resetLink = `${CLIENT_URL}/login?tab=reset&email=${encodeURIComponent(email)}&code=${resetCode}`;
  const subject = `[Technoforum] Reset Your Password - OTP: ${resetCode}`;
  const text = `Hello ${name},\nYour Technoforum password reset code is: ${resetCode}\nOr click: ${resetLink}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #070B19; color: #F8FAFC; margin: 0; padding: 20px; }
        .card { background-color: #0D1527; border: 1px solid #1E293B; border-radius: 16px; max-width: 520px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #1E293B; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #38BDF8; letter-spacing: 2px; }
        .sub { font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; }
        .otp-box { background-color: #070B19; border: 2px dashed #EF4444; border-radius: 12px; text-align: center; padding: 18px; margin: 24px 0; }
        .otp { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #F87171; font-family: monospace; }
        .btn { display: block; width: 220px; margin: 20px auto 0; text-align: center; background-color: #EF4444; color: #ffffff !important; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 10px; font-size: 14px; }
        .footer { font-size: 11px; color: #64748B; text-align: center; margin-top: 28px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">TECHNOFORUM</div>
          <div class="sub">Password Reset Request</div>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">Password Reset</h2>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
          Hello ${name}, we received a request to reset your Technoforum account password. Enter this code to proceed:
        </p>
        <div class="otp-box">
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px; text-transform: uppercase;">Reset OTP Code</div>
          <div class="otp">${resetCode}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">Valid for 15 minutes</div>
        </div>
        <p style="text-align: center; font-size: 13px; color: #94A3B8;">Or click directly to reset:</p>
        <a href="${resetLink}" class="btn">Reset Password</a>
        <div class="footer">
          If you didn't ask to reset your password, you can safely ignore this email.<br>
          Technoforum Technical Society • BIAS Bhimtal
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({ to: email, subject, html, text });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};

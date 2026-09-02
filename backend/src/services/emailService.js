// src/services/emailService.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.office365.com';
const SMTP_PORT = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE_RAW = (process.env.SMTP_SECURE || '').toLowerCase().trim();
const SMTP_SECURE = ['true', '1', 'yes', 'ssl'].includes(SMTP_SECURE_RAW) && SMTP_PORT === 465;
const SMTP_REQUIRES_TLS = ['starttls', 'tls'].includes(SMTP_SECURE_RAW) || (!SMTP_SECURE && SMTP_PORT === 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'noreply@local.test';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'NTY Apparel';

// ✅ Create Transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: SMTP_REQUIRES_TLS,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
});

// ✅ Verify Connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
};


// ✅ Send Email Function
export const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};

// ✅ OTP Email Template
export const getOTPEmailTemplate = (otp, expiresInMinutes = 10) => {
  return {
    subject: '🔐 Password Reset OTP - NTY Apparel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #000000; }
          .header h1 { font-size: 24px; color: #1a1a1a; margin: 0; }
          .header span { color: #000000; }
          .otp-box { background-color: #f8f4e8; border: 2px dashed #000000; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a; }
          .info { color: #666666; font-size: 14px; line-height: 1.6; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999; }
          .highlight { color: #000000; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NTY <span>APPAREL</span></h1>
            <p style="color: #666; font-size: 14px; margin: 5px 0 0;">Password Reset Request</p>
          </div>

          <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the OTP below to verify your identity:</p>

            <div class="otp-box">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your One-Time Password (OTP) is:</p>
              <div class="otp-code">${otp}</div>
            </div>

            <p style="font-size: 14px; color: #666;">This OTP is valid for <span class="highlight">10 minutes</span>.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
          </div>

          <div class="footer">
            <p>NTY Apparel &bull; Built for the natural athlete</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} NTY Apparel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NTY APPAREL - Password Reset OTP

      Your OTP for password reset is: ${otp}

      This OTP is valid for 10 minutes.

      If you didn't request this, please ignore this email.

      NTY Apparel - Built for the natural athlete
    `,
  };
};

// ✅ Bench Club Application Received Email
export const getBenchClubReceivedEmail = (name, tier) => {
  return {
    subject: '✅ Bench Club Application Received - NTY Apparel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #000000; }
          .header h1 { font-size: 24px; color: #1a1a1a; margin: 0; }
          .header span { color: #000000; }
          .success-icon { text-align: center; font-size: 48px; margin: 20px 0; }
          .info { color: #666666; font-size: 14px; line-height: 1.6; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999; }
          .highlight { color: #000000; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NTY <span>APPAREL</span></h1>
            <p style="color: #666; font-size: 14px; margin: 5px 0 0;">Bench Club Application</p>
          </div>

          <div style="padding: 20px 0;">
            <div class="success-icon">✅</div>
            <h2 style="text-align: center; color: #1a1a1a;">Application Received!</h2>
            <p style="font-size: 16px; color: #333; text-align: center;">Hey <span class="highlight">${name}</span>,</p>
            <p style="font-size: 16px; color: #333; text-align: center;">Your <span class="highlight">${tier} lb</span> Bench Club application has been received.</p>
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">We'll review your video and get back to you within 48 hours.</p>
          </div>

          <div class="footer">
            <p>NTY Apparel &bull; Built for the natural athlete</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} NTY Apparel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NTY APPAREL - Bench Club Application Received

      Hey ${name},

      Your ${tier} lb Bench Club application has been received.

      We'll review your video and get back to you within 48 hours.

      NTY Apparel - Built for the natural athlete
    `,
  };
};

// ✅ Generic Email
export const getGenericEmail = (subject, content) => {
  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #000000; }
          .header h1 { font-size: 24px; color: #1a1a1a; margin: 0; }
          .header span { color: #000000; }
          .content { padding: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NTY <span>APPAREL</span></h1>
          </div>
          <div class="content">${content}</div>
          <div class="footer">
            <p>NTY Apparel &bull; Built for the natural athlete</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} NTY Apparel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: content.replace(/<[^>]*>/g, ''),
  };
};
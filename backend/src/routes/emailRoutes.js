// src/routes/emailRoutes.ts
import express from 'express';
import { sendEmail, getOTPEmailTemplate, getBenchClubReceivedEmail, verifyEmailConnection } from '../services/emailService.js';

const router = express.Router();

// ✅ Test Email Connection
router.get('/test', async (req, res) => {
  const connected = await verifyEmailConnection();
  res.json({
    success: connected,
    message: connected ? 'SMTP connected successfully' : 'SMTP connection failed',
  });
});

// ✅ Send OTP Email
router.post('/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required.',
      });
    }

    const template = getOTPEmailTemplate(otp);
    await sendEmail(email, template);

    res.json({
      success: true,
      message: 'OTP sent successfully.',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP email.',
    });
  }
});

// ✅ Send Bench Club Application Received Email
router.post('/bench-club-received', async (req, res) => {
  try {
    const { email, name, tier } = req.body;

    if (!email || !name || !tier) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and tier are required.',
      });
    }

    const template = getBenchClubReceivedEmail(name, tier);
    await sendEmail(email, template);

    res.json({
      success: true,
      message: 'Application received email sent.',
    });
  } catch (error) {
    console.error('Send bench club email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send confirmation email.',
    });
  }
});

export default router;
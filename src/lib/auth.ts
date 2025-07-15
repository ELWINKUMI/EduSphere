// Sends a password reset email (placeholder, replace with real email logic)
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  // Use environment variables for SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.EMAIL_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is missing in environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'EduSphere Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your EduSphere account password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="color: #2563eb;">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br />
        <p>Best regards,<br />EduSphere Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { NextRequest } from 'next/server';

export async function getServerSession(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    if (!user) return null;
    return { user };
  } catch {
    return null;
  }
}

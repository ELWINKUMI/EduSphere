import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email, userId } = await req.json();
    let user = null;
    if (email && typeof email === 'string') {
      user = await User.findOne({ email });
    } else if (userId && typeof userId === 'string') {
      user = await User.findOne({ userId });
    } else {
      return NextResponse.json({ message: 'Email or Login ID is required.' }, { status: 400 });
    }
    if (!user) {
      return NextResponse.json({ message: 'No user found with that email or Login ID.' }, { status: 404 });
    }
    // Generate a reset token (for demo, use a random string)
    const resetToken = Math.random().toString(36).slice(2) + Date.now();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();
    // Build full reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    // Send email (implement sendPasswordResetEmail in lib/auth)
    await sendPasswordResetEmail(user.email, resetUrl);
    return NextResponse.json({ message: 'Password reset email sent.' });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }


    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token.' }, { status: 400 });
    }
    user.password = await bcrypt.hash(password, 10);
    user.pin = password; // Set pin to new password for legacy login compatibility
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return NextResponse.json({ message: 'Password has been reset.' });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}

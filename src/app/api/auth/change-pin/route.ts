import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { name, oldPin, newPin } = await req.json();
    if (!name || !oldPin || !newPin) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (typeof newPin !== 'string' || newPin.length !== 5 || !/^[0-9]{5}$/.test(newPin)) {
      return NextResponse.json({ message: 'New PIN must be exactly 5 digits.' }, { status: 400 });
    }
    await dbConnect();
    // Find student by name and oldPin
    const user = await User.findOne({ name, pin: oldPin, role: 'student' });
    if (!user) {
      return NextResponse.json({ message: 'Invalid name or old PIN.' }, { status: 401 });
    }
    // Update PIN and set firstLogin to false
    user.pin = newPin;
    user.firstLogin = false;
    await user.save();
    return NextResponse.json({ message: 'PIN changed successfully.' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to change PIN.' }, { status: 500 });
  }
}

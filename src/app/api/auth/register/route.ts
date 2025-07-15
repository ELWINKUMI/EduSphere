import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

function generateUserId() {
  // Generate a random 8-digit string
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { name, pin, role, gradeLevel, subjects, grades, email } = body;

    if (!name || !pin || !role) {
      return NextResponse.json({ error: 'Name, PIN, and role are required.' }, { status: 400 });
    }
    if (!/^[0-9]{5}$/.test(pin)) {
      return NextResponse.json({ error: 'PIN must be a 5-digit number.' }, { status: 400 });
    }
    if (role !== 'student' && role !== 'teacher') {
      return NextResponse.json({ error: 'Role must be student or teacher.' }, { status: 400 });
    }

    // Generate unique userId

    let userId;
    let exists = true;
    while (exists) {
      userId = generateUserId();
      exists = (await User.exists({ userId })) !== null;
    }

    // Allow dynamic keys for userData
    const userData: Record<string, any> = {
      userId,
      name,
      pin,
      role,
      email: email || '',
      firstLogin: true,
    };
    if (role === 'student') {
      userData['gradeLevel'] = gradeLevel;
    } else if (role === 'teacher') {
      userData['subjects'] = subjects || [];
      userData['grades'] = grades || [];
    }

    const user = new User(userData);
    await user.save();

    return NextResponse.json({
      message: 'Registration successful',
      userId: user.userId,
      name: user.name,
      role: user.role
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}

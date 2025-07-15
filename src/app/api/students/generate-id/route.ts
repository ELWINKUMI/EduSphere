import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

function generateUserId() {
  // Generates a random 8-digit string
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { studentId } = await request.json();
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }
    if (student.userId) {
      return NextResponse.json({ error: 'Student already has a userId.', userId: student.userId }, { status: 409 });
    }
    // Generate unique userId
    let userId;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10) {
      userId = generateUserId();
      exists = (await User.exists({ userId })) !== null;
      attempts++;
    }
    if (exists) {
      return NextResponse.json({ error: 'Could not generate unique userId.' }, { status: 500 });
    }
    student.userId = userId;
    await student.save();
    return NextResponse.json({ message: 'UserId generated successfully.', userId, pin: student.pin });
  } catch (error) {
    console.error('Generate student userId error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

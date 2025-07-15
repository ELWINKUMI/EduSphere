// GET: Return student profile and enrolled courses
import Course from '@/models/Course';

export async function GET(request: NextRequest) {
  await connectDB();
  // Get token from authorization header (support both server and browser fetch)
  let token = '';
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.replace('Bearer ', '');
  } else if (request.cookies.has('token')) {
    token = request.cookies.get('token')?.value || '';
  }
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let userId = '';
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return NextResponse.json({ message: 'Not found or not a student.' }, { status: 404 });
    }
    // Find all courses where this user is enrolled
    const enrolledCourses = await Course.find({ students: user._id })
      .select('_id title subject gradeLevel students')
      .lean();
    return NextResponse.json({
      name: user.name,
      email: user.email,
      enrolledCourses,
    });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch profile.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  await connectDB();
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '');
  let userId = '';
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  const { name, email, password } = await request.json();
  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required.' }, { status: 400 });
  }
  const update: any = { name, email };
  if (password) {
    update.pin = password;
  }
  try {
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    // If pin is being changed, mark as not firstLogin
    if (password) {
      user.pin = password;
      user.firstLogin = false;
    }
    user.name = name;
    user.email = email;
    await user.save();
    return NextResponse.json({ message: 'Profile updated.' });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to update profile.' }, { status: 500 });
  }
}

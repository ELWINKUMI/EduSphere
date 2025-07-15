import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// GET: Return teacher profile
export async function GET(request: NextRequest) {
  await connectDB();
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
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ message: 'Not found or not a teacher.' }, { status: 404 });
    }
    return NextResponse.json({
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch profile.' }, { status: 500 });
  }
}

// PUT: Update teacher profile
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
  const { name, email } = await request.json();
  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required.' }, { status: 400 });
  }
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') return NextResponse.json({ message: 'User not found or not a teacher.' }, { status: 404 });
    user.name = name;
    user.email = email;
    await user.save();
    return NextResponse.json({ message: 'Profile updated.' });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to update profile.' }, { status: 500 });
  }
}

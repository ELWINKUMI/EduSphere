import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// GET: Return classes (courses) the teacher teaches
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
    const teacher = await User.findById(userId);
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ message: 'Not found or not a teacher.' }, { status: 404 });
    }
    const courses = await Course.find({ teacher: teacher._id }).select('title subject gradeLevel isActive');
    return NextResponse.json({ classes: courses });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch classes.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import Course from '@/models/Course';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const auth = req.headers.get('authorization');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = auth.replace('Bearer ', '');
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Find user and check role
    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get all courses the student is enrolled in
    const courses = await Course.find({ students: user._id });
    const courseIds = courses.map((c: any) => c._id);
    // Use c.title for course name (not c.name)
    const courseMap = Object.fromEntries(courses.map((c: any) => [String(c._id), c.title]));

    // Get assignments and quizzes for these courses
    const assignments = await Assignment.find({ course: { $in: courseIds } });
    const quizzes = await Quiz.find({ course: { $in: courseIds } });

    // Map to calendar events
    const events = [
      ...assignments.map((a: any) => ({
        _id: String(a._id),
        type: 'assignment',
        title: a.title,
        dueDate: a.dueDate,
        courseName: courseMap[String(a.course)] || '',
        link: `/student/assignments/${a._id}`,
      })),
      ...quizzes.map((q: any) => ({
        _id: String(q._id),
        type: 'quiz',
        title: q.title,
        dueDate: q.dueDate,
        courseName: courseMap[String(q.course)] || '',
        link: `/student/quizzes/${q._id}`,
      })),
    ];

    return NextResponse.json({ events });
  } catch (e) {
    return NextResponse.json({ events: [] });
  }
}

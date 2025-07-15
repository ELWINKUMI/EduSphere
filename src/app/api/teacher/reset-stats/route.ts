import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import Announcement from '@/models/Announcement';
import QuizSubmission from '@/models/QuizSubmission';
import Submission from '@/models/Submission';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  await connectDB();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
  }
  const token = authHeader.substring(7);
  let userId = '';
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  try {
    const teacher = await User.findById(userId);
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Not found or not a teacher.' }, { status: 404 });
    }
    // Remove all courses taught by this teacher
    const courses = await Course.find({ teacher: teacher._id });
    for (const course of courses) {
      // Delete all submissions for assignments in this course
      await Submission.deleteMany({ assignment: { $in: course.assignments } });
      // Delete all quiz submissions for quizzes in this course
      await QuizSubmission.deleteMany({ quiz: { $in: course.quizzes } });
      // Delete assignments, quizzes, announcements
      await Assignment.deleteMany({ _id: { $in: course.assignments } });
      await Quiz.deleteMany({ _id: { $in: course.quizzes } });
      await Announcement.deleteMany({ _id: { $in: course.announcements } });
      await course.deleteOne();
    }
    // Optionally, reset teacher's subjects/grades if needed
    // teacher.subjects = [];
    // teacher.grades = [];
    // await teacher.save();
    return NextResponse.json({ message: 'Your records and stats have been reset for the new term.' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reset records.' }, { status: 500 });
  }
}

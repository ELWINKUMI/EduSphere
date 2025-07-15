import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { getServerSession } from '@/lib/auth';

// POST: Set grading scheme for a course
export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = params;
  const { assignmentWeight, quizWeight, gradeRanges } = await req.json();
  const course = await Course.findById(courseId);
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  if (course.teacher.toString() !== session.user._id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  course.assignmentWeight = assignmentWeight;
  course.quizWeight = quizWeight;
  course.gradeRanges = gradeRanges;
  await course.save();
  return NextResponse.json({ course });
}

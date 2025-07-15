import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

// POST: Update grading scheme for a course
export async function POST(req: NextRequest, context: { params: { courseId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'teacher') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = await context.params;
  const { assignmentWeight, quizWeight, gradeRanges } = await req.json();
  await Course.findByIdAndUpdate(courseId, {
    assignmentWeight,
    quizWeight,
    gradeRanges,
  });
  return NextResponse.json({ message: 'Grading scheme updated.' });
}

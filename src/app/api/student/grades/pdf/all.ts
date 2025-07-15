import { NextRequest, NextResponse } from 'next/server';
import { generateAllSubjectsReportPdf } from '@/lib/reportPdf';
import StudentReport from '@/models/StudentReport';
import Course from '@/models/Course';
import User from '@/models/User';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET: Download all subjects/grades for the student as a single PDF (always includes all enrolled subjects)
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // Get all enrolled courses for this student
  const user = await User.findById(session.user._id);
  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  }
  const enrolledCourses = await Course.find({ students: user._id })
    .select('_id title subject gradeLevel students')
    .lean();
  if (!enrolledCourses || enrolledCourses.length === 0) {
    return NextResponse.json({ message: 'No enrolled courses found.' }, { status: 404 });
  }
  // For each course, get the report (if any)
  const reports = [];
  for (const course of enrolledCourses) {
    const report = await StudentReport.findOne({ course: course._id, student: user._id });
    if (report) {
      // Attach course info for PDF
      reports.push({ ...report.toObject(), course });
    } else {
      // No report yet, create a placeholder
      reports.push({
        student: user,
        course,
        finalScore: null,
        grade: null,
        position: null,
        released: false,
        manualAdjustments: {},
        dateReleased: null,
        dateDownloaded: null,
        createdAt: null,
        updatedAt: null,
      });
    }
  }
  const pdfBytes = await generateAllSubjectsReportPdf(reports);
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=all-subjects-report.pdf`
    }
  });
}

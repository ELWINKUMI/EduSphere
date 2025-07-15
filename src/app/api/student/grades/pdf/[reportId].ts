import { NextRequest, NextResponse } from 'next/server';
import { generateStudentReportPdf } from '@/lib/reportPdf';
import StudentReport from '@/models/StudentReport';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

// GET: Download student report as PDF
export async function GET(req: NextRequest, { params }: { params: { reportId: string } }) {
  await dbConnect();
  const session = await getServerSession(req);
  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { reportId } = params;
  const report = await StudentReport.findById(reportId);
  if (!report || !report.released || report.student.toString() !== session.user._id) {
    return NextResponse.json({ message: 'Report not available' }, { status: 403 });
  }
  const pdfBytes = await generateStudentReportPdf(reportId);
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report-${reportId}.pdf`
    }
  });
}

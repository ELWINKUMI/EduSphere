import Course from '@/models/Course';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import QuizSubmission from '@/models/QuizSubmission';
import User from '@/models/User';
import StudentReport from '@/models/StudentReport';
import mongoose from 'mongoose';

/**
 * Calculate and update all student reports for a course.
 * - Weighted average: assignments/quizzes
 * - Map to grade using gradeRanges
 * - Rank students for class position
 */
export async function calculateAndUpdateReports(courseId: string) {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  const students = course.students;
  const assignments = await Assignment.find({ course: courseId });
  const quizzes = course.quizzes;

  // Get all assignment submissions for this course
  const assignmentSubmissions = await Submission.find({ assignment: { $in: assignments.map(a => a._id) } });
  // Get all quiz submissions for this course
  const quizSubs = await QuizSubmission.find({ quiz: { $in: quizzes } });

  // Calculate scores for each student
  const studentScores: Record<string, { assignmentScore: number, assignmentMax: number, quizScore: number, quizMax: number }> = {};
  for (const studentId of students) {
    // Assignment scores
    const studentAssignSubs = assignmentSubmissions.filter(s => s.student.toString() === studentId.toString() && s.grade !== undefined);
    const assignScore = studentAssignSubs.reduce((sum, s) => sum + (s.grade || 0), 0);
    const assignMax = assignments.reduce((sum, a) => sum + (a.maxPoints || 0), 0);
    // Quiz scores
    const studentQuizSubs = quizSubs.filter(qs => qs.student.toString() === studentId.toString());
    const quizScore = studentQuizSubs.reduce((sum, q) => sum + (q.score || 0), 0);
    const quizMax = quizSubs.filter(qs => qs.student.toString() === studentId.toString()).reduce((sum, q) => sum + (q.maxScore || 0), 0);
    studentScores[studentId.toString()] = {
      assignmentScore: assignScore,
      assignmentMax: assignMax,
      quizScore: quizScore,
      quizMax: quizMax
    };
  }

  // Calculate weighted score and grade
  const reports: any[] = [];
  for (const studentId of students) {
    const scores = studentScores[studentId.toString()];
    let assignmentPercent = scores.assignmentMax > 0 ? (scores.assignmentScore / scores.assignmentMax) * 100 : 0;
    let quizPercent = scores.quizMax > 0 ? (scores.quizScore / scores.quizMax) * 100 : 0;
    const weighted = ((assignmentPercent * (course.assignmentWeight || 70)) + (quizPercent * (course.quizWeight || 30))) / 100;
    // Find grade
    let grade = 'F';
    for (const range of course.gradeRanges || []) {
      if (weighted >= range.min && weighted <= range.max) {
        grade = range.grade;
        break;
      }
    }
    reports.push({ student: studentId, finalScore: weighted, grade });
  }
  // Sort for position
  reports.sort((a, b) => b.finalScore - a.finalScore);
  reports.forEach((r, i) => r.position = i + 1);

  // Upsert reports
  for (const r of reports) {
    await StudentReport.findOneAndUpdate(
      { student: r.student, course: courseId },
      { $set: { finalScore: r.finalScore, grade: r.grade, position: r.position } },
      { upsert: true }
    );
  }
  return reports;
}

export async function recalculateReportsForCourse(courseId: string) {
  return calculateAndUpdateReports(courseId);
}

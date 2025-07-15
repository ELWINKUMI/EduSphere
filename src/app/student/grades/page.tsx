"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

interface Assignment {
  _id: string;
  title: string;
  maxPoints: number;
  course: { _id: string; title: string; subject: string; gradeLevel: string };
  submissionData?: { grade?: number };
}
interface QuizSubmission {
  _id: string;
  quiz: { _id: string; title: string; course: { _id: string; title: string; subject: string; gradeLevel: string } };
  score: number;
  maxScore: number;
  submittedAt: string;
}
interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  subject: string;
  gradeLevel: string;
  assignments: Assignment[];
  quizzes: QuizSubmission[];
  totalObtained: number;
  totalPossible: number;
  average: number;
  grade: string; // Added
}

export default function StudentGradesPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  async function fetchGrades() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Fetch assignments
      const aRes = await fetch("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const aData = await aRes.json();
      // Fetch assignment submissions for actual scores
      const sRes = await fetch("/api/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sData = await sRes.json();
      // Fetch quiz submissions
      const qRes = await fetch("/api/quiz-submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const qData = await qRes.json();

      // Group assignments and quizzes by course
      const courseMap: Record<string, CourseAnalytics> = {};
      // Map assignmentId to submission (for actual scores)
      const submissionMap: Record<string, unknown> = {};
      (sData.submissions || []).forEach((sub: unknown) => {
        if (sub.assignment && sub.assignment._id) {
          submissionMap[sub.assignment._id] = sub;
        }
      });
      (aData.assignments || []).forEach((a: unknown) => {
        const c = a.course;
        if (!courseMap[c._id]) {
          courseMap[c._id] = {
            courseId: c._id,
            courseTitle: c.title,
            subject: c.subject,
            gradeLevel: c.gradeLevel,
            assignments: [],
            quizzes: [],
            totalObtained: 0,
            totalPossible: 0,
            average: 0,
            grade: 'F', // Added
          };
        }
        // Attach actual grade if available
        const submission = submissionMap[a._id];
        courseMap[c._id].assignments.push({
          ...a,
          submissionData: submission ? { grade: submission.grade } : undefined,
        });
      });
      (qData.submissions || []).forEach((q: unknown) => {
        const c = q.quiz.course;
        if (!courseMap[c._id]) {
          courseMap[c._id] = {
            courseId: c._id,
            courseTitle: c.title,
            subject: c.subject,
            gradeLevel: c.gradeLevel,
            assignments: [],
            quizzes: [],
            totalObtained: 0,
            totalPossible: 0,
            average: 0,
            grade: 'F', // Added
          };
        }
        courseMap[c._id].quizzes.push(q);
      });

      // Calculate totals, averages, and letter grades
      Object.values(courseMap).forEach((c) => {
        let obtained = 0;
        let possible = 0;
        c.assignments.forEach((a) => {
          if (a.submissionData && typeof a.submissionData.grade === "number") {
            obtained += a.submissionData.grade;
          }
          possible += a.maxPoints;
        });
        c.quizzes.forEach((q) => {
          obtained += q.score;
          possible += q.maxScore;
        });
        c.totalObtained = obtained;
        c.totalPossible = possible;
        c.average = possible > 0 ? Math.round((obtained / possible) * 100) : 0;
        // Assign letter grade (default ranges)
        let grade = 'F';
        if (c.average >= 80) grade = 'A';
        else if (c.average >= 70) grade = 'B';
        else if (c.average >= 60) grade = 'C';
        else if (c.average >= 50) grade = 'D';
        c.grade = grade;
      });

      setAnalytics(Object.values(courseMap));
    } catch (e: unknown) {
      if (typeof e === 'object' && e !== null && 'message' in e) {
        setError((e as { message?: string }).message || "Failed to load grades");
      } else {
        setError("Failed to load grades");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 px-4 py-8 flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">My Grades</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : (
          analytics.length === 0 ? (
            <div className="text-gray-300 text-center py-8">No grades or quizzes found.</div>
          ) : (
            analytics.map((course) => (
              <div
                key={course.courseId}
                className="mb-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200 hover:border-purple-400 dark:hover:border-purple-500"
              >
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-400 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-100">
                    {course.courseTitle} <span className="text-purple-400">({course.subject}, {course.gradeLevel})</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-6 mb-4">
                  <div>
                    <span className="block text-gray-400 text-sm">Total Score</span>
                    <span className="text-lg font-bold text-gray-100">{course.totalObtained} / {course.totalPossible}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-sm">Average</span>
                    <span className="text-lg font-bold text-purple-400">{course.average}%</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-sm">Grade</span>
                    <span
                      className={
                        "text-lg font-bold " +
                        (course.grade === 'A' ? 'text-green-400' :
                        course.grade === 'B' ? 'text-blue-400' :
                        course.grade === 'C' ? 'text-yellow-400' :
                        course.grade === 'D' ? 'text-orange-400' :
                        'text-red-400')
                      }
                    >
                      {course.grade}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Assignments</h3>
                    <table className="w-full text-sm text-left text-gray-400">
                      <thead>
                        <tr>
                          <th className="py-2">Title</th>
                          <th className="py-2">Score</th>
                          <th className="py-2">Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.assignments.length === 0 ? (
                          <tr><td colSpan={3} className="py-2 text-center text-gray-500">No assignments</td></tr>
                        ) : course.assignments.map((a) => (
                          <tr key={a._id}>
                            <td className="py-2">{a.title}</td>
                            <td className="py-2">{a.submissionData && typeof a.submissionData.grade === "number" ? a.submissionData.grade : <span className="text-gray-500">N/A</span>}</td>
                            <td className="py-2">{a.maxPoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Quizzes</h3>
                    <table className="w-full text-sm text-left text-gray-400">
                      <thead>
                        <tr>
                          <th className="py-2">Title</th>
                          <th className="py-2">Score</th>
                          <th className="py-2">Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.quizzes.length === 0 ? (
                          <tr><td colSpan={3} className="py-2 text-center text-gray-500">No quizzes</td></tr>
                        ) : course.quizzes.map((q) => (
                          <tr key={q._id}>
                            <td className="py-2">{q.quiz.title}</td>
                            <td className="py-2">{q.score}</td>
                            <td className="py-2">{q.maxScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )
        )}
        <div className="mt-8 text-center">
          <Link href="/student/dashboard" className="text-purple-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

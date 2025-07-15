
"use client";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  students: { _id: string; name: string }[];
}

interface Report {
  _id: string;
  course: {
    _id: string;
    subject: string;
    gradeLevel: string;
    title: string;
  };
  finalScore: number;
  grade: string;
  position: number;
  released: boolean;
  dateDownloaded?: string;
}


export default function StudentReportsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [reports, setReports] = useState<Record<string, Report | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "student") return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get enrolled courses with student lists
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch("/api/student/profile", {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Unauthorized');
      const { enrolledCourses } = await res.json();
      // 2. Use enrolledCourses directly (no teacher API call)
      setCourses(enrolledCourses.map((course: any) => ({ ...course, students: course.students || [] })));

      // 3. For each course, get the report (if any)
      const reportMap: Record<string, Report | null> = {};
      await Promise.all(
        enrolledCourses.map(async (course: any) => {
          try {
            const r = await fetch(`/api/student/grades/${course._id}`);
            if (r.ok) {
              const { report } = await r.json();
              if (report) {
                reportMap[course._id] = { ...report, course };
              }
            } else if (r.status === 404) {
              // No report exists for this course, add empty entry
              reportMap[course._id] = null;
            }
          } catch {
            reportMap[course._id] = null;
          }
        })
      );
      setReports(reportMap);
    } catch (e) {
      setCourses([]);
      setReports({});
    }
    setLoading(false);
  };

  // Download all released subject reports as a single PDF
  const handleDownloadAll = async () => {
    try {
      const res = await fetch(`/api/student/grades/pdf/all`, { method: 'GET' });
      if (res.status === 404) {
        toast.error('No enrolled subjects found.');
        return;
      }
      if (!res.ok) {
        toast.error('Failed to download PDF. Please try again.');
        return;
      }
      // Always allow download if enrolled, even if all N/A
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-subjects-report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Only students can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">
          My Subject Reports
        </h1>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-400">No enrolled subjects yet.</div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const report = reports[course._id];
              const totalStudents = course.students?.length || 0;
              const studentName = user?.name || "";
              const today = new Date().toLocaleDateString();
              return (
                <div
                  key={course._id}
                  className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-700"
                >
                  <div>
                    <div className="text-lg font-semibold text-purple-400">
                      {course.subject} ({course.title})
                    </div>
                    <div className="text-gray-300">Class: {course.gradeLevel}</div>
                    <div className="text-gray-300">
                      Score: <span className="font-bold">{report && report.released ? report.finalScore?.toFixed(2) : 'N/A'}</span> | Grade: <span className="font-bold">{report && report.released ? report.grade : 'N/A'}</span> | Position: <span className="font-bold">{report && report.released ? report.position : 'N/A'}</span>
                      {!report && <span className="ml-2 text-xs text-yellow-400">(No report yet)</span>}
                    </div>
                    <div className="text-gray-300 mt-1">
                      Total Students: <span className="font-bold">{totalStudents}</span>
                    </div>
                    <div className="text-gray-300 mt-1">
                      Student Name: <span className="font-bold">{studentName}</span>
                    </div>
                    <div className="text-gray-300 mt-1">
                      Date: <span className="font-bold">{today}</span>
                    </div>
                  </div>
                  {/* Per-subject download removed, replaced by all-in-one below */}
                </div>
              );
            })}
            {/* Download all subjects/grades as one PDF */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleDownloadAll}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download All Subjects PDF
              </button>
            </div>
          </div>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/student/dashboard"
            className="text-purple-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

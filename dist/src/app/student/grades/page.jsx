"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
export default function StudentGradesPage() {
    var _a = useState(true), loading = _a[0], setLoading = _a[1];
    var _b = useState([]), analytics = _b[0], setAnalytics = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        fetchGrades();
    }, []);
    function fetchGrades() {
        return __awaiter(this, void 0, void 0, function () {
            var token, aRes, aData, sRes, sData, qRes, qData, courseMap_1, submissionMap_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 10]);
                        token = localStorage.getItem("token");
                        if (!token)
                            throw new Error("Not authenticated");
                        return [4 /*yield*/, fetch("/api/assignments", {
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 2:
                        aRes = _a.sent();
                        return [4 /*yield*/, aRes.json()];
                    case 3:
                        aData = _a.sent();
                        return [4 /*yield*/, fetch("/api/submissions", {
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 4:
                        sRes = _a.sent();
                        return [4 /*yield*/, sRes.json()];
                    case 5:
                        sData = _a.sent();
                        return [4 /*yield*/, fetch("/api/quiz-submissions", {
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 6:
                        qRes = _a.sent();
                        return [4 /*yield*/, qRes.json()];
                    case 7:
                        qData = _a.sent();
                        courseMap_1 = {};
                        submissionMap_1 = {};
                        (sData.submissions || []).forEach(function (sub) {
                            if (sub.assignment && sub.assignment._id) {
                                submissionMap_1[sub.assignment._id] = sub;
                            }
                        });
                        (aData.assignments || []).forEach(function (a) {
                            var c = a.course;
                            if (!courseMap_1[c._id]) {
                                courseMap_1[c._id] = {
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
                            var submission = submissionMap_1[a._id];
                            courseMap_1[c._id].assignments.push(__assign(__assign({}, a), { submissionData: submission ? { grade: submission.grade } : undefined }));
                        });
                        (qData.submissions || []).forEach(function (q) {
                            var c = q.quiz.course;
                            if (!courseMap_1[c._id]) {
                                courseMap_1[c._id] = {
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
                            courseMap_1[c._id].quizzes.push(q);
                        });
                        // Calculate totals, averages, and letter grades
                        Object.values(courseMap_1).forEach(function (c) {
                            var obtained = 0;
                            var possible = 0;
                            c.assignments.forEach(function (a) {
                                if (a.submissionData && typeof a.submissionData.grade === "number") {
                                    obtained += a.submissionData.grade;
                                }
                                possible += a.maxPoints;
                            });
                            c.quizzes.forEach(function (q) {
                                obtained += q.score;
                                possible += q.maxScore;
                            });
                            c.totalObtained = obtained;
                            c.totalPossible = possible;
                            c.average = possible > 0 ? Math.round((obtained / possible) * 100) : 0;
                            // Assign letter grade (default ranges)
                            var grade = 'F';
                            if (c.average >= 80)
                                grade = 'A';
                            else if (c.average >= 70)
                                grade = 'B';
                            else if (c.average >= 60)
                                grade = 'C';
                            else if (c.average >= 50)
                                grade = 'D';
                            c.grade = grade;
                        });
                        setAnalytics(Object.values(courseMap_1));
                        return [3 /*break*/, 10];
                    case 8:
                        e_1 = _a.sent();
                        if (typeof e_1 === 'object' && e_1 !== null && 'message' in e_1) {
                            setError(e_1.message || "Failed to load grades");
                        }
                        else {
                            setError("Failed to load grades");
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    return (<div className="min-h-screen bg-gray-900 dark:bg-gray-900 px-4 py-8 flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">My Grades</h1>
        {loading ? (<div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>) : error ? (<div className="text-red-400 text-center py-8">{error}</div>) : (analytics.length === 0 ? (<div className="text-gray-300 text-center py-8">No grades or quizzes found.</div>) : (analytics.map(function (course) { return (<div key={course.courseId} className="mb-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200 hover:border-purple-400 dark:hover:border-purple-500">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-400 mr-2"/>
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
                    <span className={"text-lg font-bold " +
                (course.grade === 'A' ? 'text-green-400' :
                    course.grade === 'B' ? 'text-blue-400' :
                        course.grade === 'C' ? 'text-yellow-400' :
                            course.grade === 'D' ? 'text-orange-400' :
                                'text-red-400')}>
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
                        {course.assignments.length === 0 ? (<tr><td colSpan={3} className="py-2 text-center text-gray-500">No assignments</td></tr>) : course.assignments.map(function (a) { return (<tr key={a._id}>
                            <td className="py-2">{a.title}</td>
                            <td className="py-2">{a.submissionData && typeof a.submissionData.grade === "number" ? a.submissionData.grade : <span className="text-gray-500">N/A</span>}</td>
                            <td className="py-2">{a.maxPoints}</td>
                          </tr>); })}
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
                        {course.quizzes.length === 0 ? (<tr><td colSpan={3} className="py-2 text-center text-gray-500">No quizzes</td></tr>) : course.quizzes.map(function (q) { return (<tr key={q._id}>
                            <td className="py-2">{q.quiz.title}</td>
                            <td className="py-2">{q.score}</td>
                            <td className="py-2">{q.maxScore}</td>
                          </tr>); })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>); })))}
        <div className="mt-8 text-center">
          <Link href="/student/dashboard" className="text-purple-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>);
}

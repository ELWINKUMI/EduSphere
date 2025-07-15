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
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
export default function StudentReportsPage() {
    var _this = this;
    var user = useAuth().user;
    var _a = useState([]), courses = _a[0], setCourses = _a[1];
    var _b = useState({}), reports = _b[0], setReports = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    useEffect(function () {
        if (!user || user.role !== "student")
            return;
        fetchData();
    }, [user]);
    var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, res, enrolledCourses, reportMap_1, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
                    return [4 /*yield*/, fetch("/api/student/profile", {
                            headers: token ? { 'Authorization': "Bearer ".concat(token) } : {},
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('Unauthorized');
                    return [4 /*yield*/, res.json()];
                case 3:
                    enrolledCourses = (_a.sent()).enrolledCourses;
                    // 2. Use enrolledCourses directly (no teacher API call)
                    setCourses(enrolledCourses.map(function (course) { return (__assign(__assign({}, course), { students: course.students || [] })); }));
                    reportMap_1 = {};
                    return [4 /*yield*/, Promise.all(enrolledCourses.map(function (course) { return __awaiter(_this, void 0, void 0, function () {
                            var r, report, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 5, , 6]);
                                        return [4 /*yield*/, fetch("/api/student/grades/".concat(course._id))];
                                    case 1:
                                        r = _b.sent();
                                        if (!r.ok) return [3 /*break*/, 3];
                                        return [4 /*yield*/, r.json()];
                                    case 2:
                                        report = (_b.sent()).report;
                                        if (report) {
                                            reportMap_1[course._id] = __assign(__assign({}, report), { course: course });
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        if (r.status === 404) {
                                            // No report exists for this course, add empty entry
                                            reportMap_1[course._id] = null;
                                        }
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        _a = _b.sent();
                                        reportMap_1[course._id] = null;
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _a.sent();
                    setReports(reportMap_1);
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    setCourses([]);
                    setReports({});
                    return [3 /*break*/, 6];
                case 6:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Download all released subject reports as a single PDF
    var handleDownloadAll = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, blob, url, a, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/student/grades/pdf/all", { method: 'GET' })];
                case 1:
                    res = _a.sent();
                    if (res.status === 404) {
                        toast.error('No enrolled subjects found.');
                        return [2 /*return*/];
                    }
                    if (!res.ok) {
                        toast.error('Failed to download PDF. Please try again.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, res.blob()];
                case 2:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = 'all-subjects-report.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    toast.error('Failed to download PDF. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (!user || user.role !== "student") {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Only students can access this page.</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">
          My Subject Reports
        </h1>
        {loading ? (<div className="text-center text-gray-400">Loading...</div>) : courses.length === 0 ? (<div className="text-center text-gray-400">No enrolled subjects yet.</div>) : (<div className="space-y-6">
            {courses.map(function (course) {
                var _a, _b;
                var report = reports[course._id];
                var totalStudents = ((_a = course.students) === null || _a === void 0 ? void 0 : _a.length) || 0;
                var studentName = (user === null || user === void 0 ? void 0 : user.name) || "";
                var today = new Date().toLocaleDateString();
                return (<div key={course._id} className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-700">
                  <div>
                    <div className="text-lg font-semibold text-purple-400">
                      {course.subject} ({course.title})
                    </div>
                    <div className="text-gray-300">Class: {course.gradeLevel}</div>
                    <div className="text-gray-300">
                      Score: <span className="font-bold">{report && report.released ? (_b = report.finalScore) === null || _b === void 0 ? void 0 : _b.toFixed(2) : 'N/A'}</span> | Grade: <span className="font-bold">{report && report.released ? report.grade : 'N/A'}</span> | Position: <span className="font-bold">{report && report.released ? report.position : 'N/A'}</span>
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
                </div>);
            })}
            {/* Download all subjects/grades as one PDF */}
            <div className="flex justify-end mt-6">
              <button onClick={handleDownloadAll} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Download All Subjects PDF
              </button>
            </div>
          </div>)}
        <div className="mt-8 text-center">
          <Link href="/student/dashboard" className="text-purple-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>);
}

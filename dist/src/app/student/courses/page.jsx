'use client';
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
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { BookOpen, Users, Calendar, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function StudentCoursesPage() {
    var _this = this;
    var user = useAuth().user;
    var _a = useState([]), courses = _a[0], setCourses = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(''), enrollmentCode = _c[0], setEnrollmentCode = _c[1];
    var _d = useState(false), enrolling = _d[0], setEnrolling = _d[1];
    var _e = useState(false), showEnrollModal = _e[0], setShowEnrollModal = _e[1];
    useEffect(function () {
        fetchCourses();
    }, []);
    var fetchCourses = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    token = localStorage.getItem('token');
                    if (!token)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch('/api/courses', {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setCourses(data.courses || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching courses:', error_1);
                    toast.error('Failed to load courses');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleEnrollment = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!enrollmentCode.trim()) {
                        toast.error('Please enter an enrollment code');
                        return [2 /*return*/];
                    }
                    setEnrolling(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/courses/enroll', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({
                                enrollmentCode: enrollmentCode.trim()
                            })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        toast.success('Successfully enrolled in course!');
                        setEnrollmentCode('');
                        setShowEnrollModal(false);
                        fetchCourses(); // Refresh courses
                    }
                    else {
                        toast.error(data.error || 'Failed to enroll in course');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error enrolling in course:', error_2);
                    toast.error('Failed to enroll in course');
                    return [3 /*break*/, 6];
                case 5:
                    setEnrolling(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var getSubjectColor = function (subject) {
        var colors = {
            'Mathematics': 'from-blue-500 to-blue-600',
            'English Language': 'from-green-500 to-green-600',
            'Science': 'from-purple-500 to-purple-600',
            'Social Studies': 'from-orange-500 to-orange-600',
            'History': 'from-red-500 to-red-600',
            'Geography': 'from-teal-500 to-teal-600',
            'Physics': 'from-indigo-500 to-indigo-600',
            'Chemistry': 'from-pink-500 to-pink-600',
            'Biology': 'from-emerald-500 to-emerald-600',
        };
        return colors[subject] || 'from-gray-500 to-gray-600';
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Courses
              </h1>
              <p className="text-gray-600">Access your enrolled courses and materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={function () { return setShowEnrollModal(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                <Plus className="h-4 w-4"/>
                <span>Enroll in Course</span>
              </button>
              <Link href="/student/dashboard" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {courses.length === 0 ? (<div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-blue-500"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Use an enrollment code to join a course.
            </p>
            <button onClick={function () { return setShowEnrollModal(true); }} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto">
              <Plus className="h-5 w-5"/>
              <span>Enroll in Your First Course</span>
            </button>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {courses.map(function (course) {
                var _a;
                return (<div key={course.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Course Header */}
                <div className={"bg-gradient-to-r ".concat(getSubjectColor(course.subject), " p-6 text-white")}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-white/90 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/80 text-sm">{course.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/70 mb-1">Grade</div>
                      <div className="text-sm font-medium">{course.gradeLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Teacher Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600"/>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{((_a = course.teacher) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">Course Instructor</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4"/>
                        <span>Started {formatDate(course.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4"/>
                        <span>Max {course.maxStudents}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Link href={"/student/courses/".concat(course.id)} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center">
                        View Course
                      </Link>
                      <Link href={"/student/courses/".concat(course.id, "/assignments")} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText className="h-4 w-4"/>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>);
            })}
          </div>)}
      </main>

      {/* Enrollment Modal */}
      {showEnrollModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Enroll in Course</h3>
            </div>
            <form onSubmit={handleEnrollment} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Code
                </label>
                <input type="text" value={enrollmentCode} onChange={function (e) { return setEnrollmentCode(e.target.value.toUpperCase()); }} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Enter course code (e.g., MAT101ABC)" required/>
                <p className="text-xs text-gray-500 mt-2">
                  Get this code from your teacher or course announcement
                </p>
              </div>

              <div className="flex space-x-3">
                <button type="button" onClick={function () {
                setShowEnrollModal(false);
                setEnrollmentCode('');
            }} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={enrolling} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {enrolling ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
}

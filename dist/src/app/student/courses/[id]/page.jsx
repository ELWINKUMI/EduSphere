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
import { useRouter, useParams } from 'next/navigation';
import { BookOpen, ArrowLeft, Clock, FileText, Download, Play, CheckCircle, XCircle, AlertCircle, Bell, GraduationCap, BarChart3, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function StudentCourseDetailPage() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    // Defensive: handle both string and array (Next.js App Router)
    var courseId = '';
    if (params && params.id) {
        if (typeof params.id === 'string') {
            courseId = params.id;
        }
        else if (Array.isArray(params.id)) {
            courseId = params.id[0];
        }
    }
    var _l = useState(null), subject = _l[0], setSubject = _l[1];
    var _m = useState([]), assignments = _m[0], setAssignments = _m[1];
    var _o = useState([]), quizzes = _o[0], setQuizzes = _o[1];
    var _p = useState([]), resources = _p[0], setResources = _p[1];
    var _q = useState([]), announcements = _q[0], setAnnouncements = _q[1];
    var _r = useState([]), grades = _r[0], setGrades = _r[1];
    var _s = useState(true), loading = _s[0], setLoading = _s[1];
    var _t = useState(null), selectedAnalytics = _t[0], setSelectedAnalytics = _t[1];
    var _u = useState(null), analyticsData = _u[0], setAnalyticsData = _u[1];
    var _v = useState(false), analyticsLoading = _v[0], setAnalyticsLoading = _v[1];
    var tabList = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'quizzes', label: 'Quizzes', icon: Play },
        { id: 'resources', label: 'Resources', icon: Download },
        { id: 'announcements', label: 'Announcements', icon: Bell },
        { id: 'gradebook', label: 'Gradebook', icon: GraduationCap },
    ];
    var _w = useState('overview'), activeTab = _w[0], setActiveTab = _w[1];
    useEffect(function () {
        // Only fetch if courseId is a valid 24-char hex string
        if (courseId && /^[0-9a-fA-F]{24}$/.test(courseId)) {
            fetchSubjectDetails();
        }
    }, [courseId]);
    var fetchSubjectDetails = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/auth/login');
                        return [2 /*return*/];
                    }
                    // Defensive: skip fetch if courseId is invalid
                    if (!courseId || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
                        toast.error('Invalid course ID');
                        router.push('/student/courses');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId), {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setSubject(data.course);
                    // Fetch related data
                    return [4 /*yield*/, Promise.all([
                            fetchAssignments(),
                            fetchQuizzes(),
                            fetchResources(),
                            fetchAnnouncements(),
                            fetchGrades()
                        ])];
                case 3:
                    // Fetch related data
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    if (response.status === 404) {
                        toast.error('Subject not found');
                        router.push('/student/courses');
                    }
                    else if (response.status === 400) {
                        toast.error('Invalid course ID');
                        router.push('/student/courses');
                    }
                    else {
                        toast.error('Failed to load subject details');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error fetching subject details:', error_1);
                    toast.error('Error loading subject details');
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var fetchAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/assignments"), {
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
                    setAssignments(data.assignments || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching assignments:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchQuizzes = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/quizzes"), {
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
                    setQuizzes(data.quizzes || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error fetching quizzes:', error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchResources = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/resources"), {
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
                    setResources(data.resources || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error fetching resources:', error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchAnnouncements = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/announcements"), {
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
                    setAnnouncements(data.announcements || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error('Error fetching announcements:', error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchGrades = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/grades"), {
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
                    setGrades(data.grades || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_6 = _a.sent();
                    console.error('Error fetching grades:', error_6);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchItemAnalytics = function (type, itemId, title) { return __awaiter(_this, void 0, void 0, function () {
        var token, endpoint, response, data, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setAnalyticsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    endpoint = type === 'quiz' ? "/api/quizzes/".concat(itemId, "/analytics") : "/api/assignments/".concat(itemId, "/analytics");
                    return [4 /*yield*/, fetch(endpoint, {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    setAnalyticsData(data);
                    setSelectedAnalytics({ type: type, itemId: itemId, title: title });
                    return [3 /*break*/, 5];
                case 4:
                    toast.error('Failed to load analytics');
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_7 = _a.sent();
                    console.error('Error fetching analytics:', error_7);
                    toast.error('Error loading analytics');
                    return [3 /*break*/, 8];
                case 7:
                    setAnalyticsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'submitted':
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500"/>;
            case 'pending':
            case 'available':
                return <Clock className="h-4 w-4 text-yellow-500"/>;
            case 'graded':
                return <CheckCircle className="h-4 w-4 text-blue-500"/>;
            case 'expired':
                return <XCircle className="h-4 w-4 text-red-500"/>;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500"/>;
        }
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'submitted':
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'pending':
            case 'available':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'graded':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'expired':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };
    var downloadFile = function (filename) {
        // Extract just the filename if it contains path separators
        var cleanFilename = filename.includes('/') ? filename.split('/').pop() : filename;
        if (cleanFilename) {
            window.open("/api/assignments/download/".concat(cleanFilename), '_blank');
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    if (!subject) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4"/>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Subject Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The subject you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/student/courses" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Subjects
          </Link>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-2 sm:gap-0">
            <div className="flex items-center w-full">
              <Link href="/student/courses" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">{subject.title}</h1>
              <span className="ml-auto px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full whitespace-nowrap">
                {((_a = subject.enrolledStudents) === null || _a === void 0 ? void 0 : _a.length) || 0} / {subject.maxStudents} students
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mt-1">
            <p className="text-gray-600 dark:text-gray-400">
              {subject.subject} • {subject.gradeLevel} • {subject.teacher.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4 md:mb-8">
          {tabList.map(function (_a) {
            var id = _a.id, label = _a.label, Icon = _a.icon;
            return (<button key={id} type="button" onClick={function () { return setActiveTab(id); }} className={"flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ".concat(activeTab === id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400')} aria-selected={activeTab === id} aria-controls={"tab-panel-".concat(id)}>
              <Icon className="h-4 w-4 mr-2"/>
              {label}
            </button>);
        })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (<div className="flex flex-col lg:flex-row gap-3 md:gap-6 items-stretch w-full tab-panel">
            {/* Subject Details */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-3 sm:p-4 md:p-6 mb-3 lg:mb-0 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About This Subject</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {subject.description || 'No description provided for this subject.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                    <p className="text-gray-600 dark:text-gray-400">{subject.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Grade Level:</span>
                    <p className="text-gray-600 dark:text-gray-400">{subject.gradeLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Teacher:</span>
                    <p className="text-gray-600 dark:text-gray-400">{subject.teacher.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Enrollment Code:</span>
                    <p className="text-gray-600 dark:text-gray-400 font-mono">{subject.enrollmentCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Announcements */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 md:gap-6 items-start mt-3 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-3 sm:p-4 md:p-6 text-left w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{quizzes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Resources</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{resources.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Announcements</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{announcements.length}</span>
                  </div>
                </div>
              </div>

              {/* Recent Announcements */}
              {announcements.length > 0 && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-3 sm:p-4 md:p-6 text-left w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map(function (announcement) { return (<div key={announcement._id} className="border-l-4 border-blue-500 pl-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {announcement.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>); })}
                  </div>
                </div>)}
            </div>
          </div>)}

        {activeTab === 'assignments' && (<div className="space-y-2 md:space-y-4 text-left w-full tab-panel">
            {assignments.length === 0 ? (<div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No assignments yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Assignments will appear here when your teacher creates them.
                </p>
              </div>) : (assignments.map(function (assignment) { return (<div key={assignment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        {assignment.grade && (<span>Grade: {assignment.grade}%</span>)}
                        {assignment.attachments && assignment.attachments.length > 0 && (<span>{assignment.attachments.length} file{assignment.attachments.length > 1 ? 's' : ''}</span>)}
                      </div>
                      
                      {/* Assignment Files */}
                      {assignment.attachments && assignment.attachments.length > 0 && (<div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Assignment Files:</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map(function (filename, index) {
                        if (!filename)
                            return null;
                        var cleanFilename = filename.includes('/') ? filename.split('/').pop() : filename;
                        var displayName = (cleanFilename === null || cleanFilename === void 0 ? void 0 : cleanFilename.split('-').slice(1).join('-')) || cleanFilename || filename;
                        return (<button key={index} onClick={function () { return downloadFile(filename); }} className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                                  <Download className="h-3 w-3 mr-1"/>
                                  {displayName}
                                </button>);
                    })}
                          </div>
                        </div>)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={"flex items-center px-3 py-1 rounded-full text-sm font-medium ".concat(getStatusColor(assignment.status))}>
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1 capitalize">{assignment.status}</span>
                      </span>
                      {assignment.status === 'pending' && (<Link href={"/student/assignments/".concat(assignment._id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Submit
                        </Link>)}
                    </div>
                  </div>
                  {assignment.feedback && (<div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Teacher Feedback:</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{assignment.feedback}</p>
                    </div>)}
                </div>); }))}
          </div>)}

        {activeTab === 'quizzes' && (<div className="space-y-2 md:space-y-4 text-left w-full tab-panel">
            {quizzes.length === 0 ? (<div className="text-center py-12">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Quizzes will appear here when your teacher creates them.
                </p>
              </div>) : (quizzes.map(function (quiz) { return (<div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {quiz.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{quiz.totalQuestions} questions</span>
                        <span>{quiz.timeLimit} minutes</span>
                        <span>Available until: {new Date(quiz.availableUntil).toLocaleDateString()}</span>
                        {quiz.score !== undefined && (<span>Score: {quiz.score}/{quiz.maxScore}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={"flex items-center px-3 py-1 rounded-full text-sm font-medium ".concat(getStatusColor(quiz.status))}>
                        {getStatusIcon(quiz.status)}
                        <span className="ml-1 capitalize">{quiz.status}</span>
                      </span>
                      {quiz.status === 'available' && (<Link href={"/student/quizzes/".concat(quiz._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Take Quiz
                        </Link>)}
                    </div>
                  </div>
                </div>); }))}
          </div>)}

        {activeTab === 'resources' && (<div className="space-y-2 md:space-y-4 text-left w-full tab-panel">
            {resources.length === 0 ? (<div className="text-center py-12">
                <Download className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resources yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Course resources will appear here when your teacher uploads them.
                </p>
              </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 text-left w-full items-start justify-start">
                {resources.map(function (resource) { return (<div key={resource._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {resource.type.toUpperCase()} • {new Date(resource.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Download className="h-5 w-5 text-gray-400"/>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                      <Download className="h-4 w-4 mr-1"/>
                      View/Download
                    </a>
                  </div>); })}
              </div>)}
          </div>)}

        {activeTab === 'announcements' && (<div className="space-y-2 md:space-y-4 text-left w-full tab-panel">
            {announcements.length === 0 ? (<div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No announcements yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Course announcements will appear here when your teacher posts them.
                </p>
              </div>) : (announcements.map(function (announcement) { return (<div key={announcement._id} className={"bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 ".concat(announcement.isImportant ? 'border-l-4 border-l-red-500' : '')}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {announcement.title}
                      </h3>
                      {announcement.isImportant && (<span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                          Important
                        </span>)}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {announcement.content}
                  </p>
                </div>); }))}
          </div>)}

        {activeTab === 'gradebook' && (<div className="space-y-2 md:space-y-4 text-left w-full mx-auto mt-0 pt-0 tab-panel">
            {grades.length === 0 ? (<div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No grades yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your grades will appear here once assignments and quizzes are graded.
                </p>
              </div>) : (<div>
                {/* Grade Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-3 sm:p-4 md:p-6 mb-3 md:mb-6 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {grades.length > 0 ? Math.round(grades.reduce(function (sum, grade) { return sum + grade.percentage; }, 0) / grades.length) : 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Overall Average</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {grades.filter(function (g) { return g.percentage >= 80; }).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">A's & B's</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {grades.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Graded</div>
                    </div>
                  </div>
                </div>

                {/* Grades List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden text-left">
                  <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grade Details</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[600px] divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Percentage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Analytics
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {grades.map(function (grade) { return (<tr key={grade._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {grade.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(grade.type === 'assignment'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400')}>
                                {grade.type === 'assignment' ? 'Assignment' : 'Quiz'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {grade.score}/{grade.maxScore}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={"font-medium ".concat(grade.percentage >= 90 ? 'text-green-600 dark:text-green-400' :
                        grade.percentage >= 80 ? 'text-blue-600 dark:text-blue-400' :
                            grade.percentage >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                                grade.percentage >= 60 ? 'text-orange-600 dark:text-orange-400' :
                                    'text-red-600 dark:text-red-400')}>
                                  {grade.percentage}%
                                </div>
                                <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div className={"h-2 rounded-full ".concat(grade.percentage >= 90 ? 'bg-green-600' :
                        grade.percentage >= 80 ? 'bg-blue-600' :
                            grade.percentage >= 70 ? 'bg-yellow-600' :
                                grade.percentage >= 60 ? 'bg-orange-600' :
                                    'bg-red-600')} style={{ width: "".concat(grade.percentage, "%") }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(grade.gradedAt || grade.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={function () { return fetchItemAnalytics(grade.type, grade.itemId, grade.title); }} className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors text-sm">
                                <BarChart3 className="h-3 w-3 mr-1"/>
                                View Analytics
                              </button>
                            </td>
                          </tr>); })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>)}
          </div>)}

        {/* Analytics Modal */}
        {selectedAnalytics && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 md:p-6 border-b dark:border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedAnalytics.title} - Score Distribution
                </h3>
                <button onClick={function () {
                setSelectedAnalytics(null);
                setAnalyticsData(null);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-gray-500"/>
                </button>
              </div>

              <div className="p-4 md:p-6">
                {analyticsLoading ? (<div className="flex items-center justify-center py-8 md:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>) : analyticsData ? (<div className="space-y-4 md:space-y-6">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {((_b = analyticsData.statistics) === null || _b === void 0 ? void 0 : _b.totalSubmissions) || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {((_c = analyticsData.statistics) === null || _c === void 0 ? void 0 : _c.averageScore) || 0}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Class Average</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {((_d = analyticsData.statistics) === null || _d === void 0 ? void 0 : _d.completionRate) || 0}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {((_g = (_f = (_e = analyticsData.statistics) === null || _e === void 0 ? void 0 : _e.scoreData) === null || _f === void 0 ? void 0 : _f.find(function (d) { return d.range === '90-100'; })) === null || _g === void 0 ? void 0 : _g.count) || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">A Grades (90-100%)</div>
                      </div>
                    </div>

                    {/* Score Distribution Chart */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2"/>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Score Distribution</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {(_j = (_h = analyticsData.statistics) === null || _h === void 0 ? void 0 : _h.scoreData) === null || _j === void 0 ? void 0 : _j.map(function (data) { return (<div key={data.range} className="flex items-center">
                            <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
                              {data.range}%
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: "".concat(data.percentage, "%") }}></div>
                              </div>
                            </div>
                            <div className="w-24 text-right">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.count}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({data.percentage}%)</span>
                            </div>
                          </div>); })}
                      </div>

                      {(!((_k = analyticsData.statistics) === null || _k === void 0 ? void 0 : _k.scoreData) || analyticsData.statistics.scoreData.length === 0) && (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No score data available yet
                        </div>)}
                    </div>

                    {/* Your Performance */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Performance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {(function () {
                    var _a;
                    var userGrade = grades.find(function (g) { return g.itemId === selectedAnalytics.itemId; });
                    if (!userGrade)
                        return <div>No grade data available</div>;
                    var classAverage = ((_a = analyticsData.statistics) === null || _a === void 0 ? void 0 : _a.averageScore) || 0;
                    var performanceDiff = userGrade.percentage - classAverage;
                    return (<>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Score</div>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {userGrade.percentage}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {userGrade.score}/{userGrade.maxScore} points
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">vs Class Average</div>
                                <div className={"text-2xl font-bold ".concat(performanceDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                                  {performanceDiff >= 0 ? '+' : ''}{Math.round(performanceDiff)}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {performanceDiff >= 0 ? 'Above' : 'Below'} class average
                                </div>
                              </div>
                            </>);
                })()}
                      </div>
                    </div>
                  </div>) : (<div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Failed to load analytics data
                  </div>)}
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}

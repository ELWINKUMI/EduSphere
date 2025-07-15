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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// Lazy load the profile page for the side panel
var StudentProfilePanel = dynamic(function () { return import('../profile/page'); }, { ssr: false });
import { BookOpen, FileText, Calendar, Bell, Clock, CheckCircle, AlertCircle, Trophy, LogOut, Sun, Moon, Menu, X, User, Settings, HelpCircle, GraduationCap, PenTool, BarChart3 } from 'lucide-react';
export default function StudentDashboard() {
    var _this = this;
    var _a = useState(false), showProfilePanel = _a[0], setShowProfilePanel = _a[1];
    var _b = useAuth(), user = _b.user, loading = _b.loading, logout = _b.logout;
    var toggleTheme = useTheme().toggleTheme;
    var router = useRouter();
    var _c = useState({
        enrolledCourses: 0,
        pendingAssignments: 0,
        upcomingQuizzes: 0,
        overallGrade: 'N/A',
    }), stats = _c[0], setStats = _c[1];
    var _d = useState('N/A'), overallGrade = _d[0], setOverallGrade = _d[1];
    // Fetch overall grade from gradebook
    useEffect(function () {
        function fetchOverallGrade() {
            return __awaiter(this, void 0, void 0, function () {
                var token, aRes, aData, sRes, sData, qRes, qData, submissionMap_1, courseMap_1, totalObtained_1, totalPossible_1, avg, grade, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            token = localStorage.getItem('token');
                            if (!token)
                                return [2 /*return*/];
                            return [4 /*yield*/, fetch('/api/assignments', { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 1:
                            aRes = _b.sent();
                            return [4 /*yield*/, aRes.json()];
                        case 2:
                            aData = _b.sent();
                            return [4 /*yield*/, fetch('/api/submissions', { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 3:
                            sRes = _b.sent();
                            return [4 /*yield*/, sRes.json()];
                        case 4:
                            sData = _b.sent();
                            return [4 /*yield*/, fetch('/api/quiz-submissions', { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 5:
                            qRes = _b.sent();
                            return [4 /*yield*/, qRes.json()];
                        case 6:
                            qData = _b.sent();
                            submissionMap_1 = {};
                            (sData.submissions || []).forEach(function (sub) {
                                if (typeof sub === 'object' &&
                                    sub !== null &&
                                    'assignment' in sub &&
                                    typeof sub.assignment === 'object' &&
                                    sub.assignment !== null &&
                                    '_id' in sub.assignment) {
                                    submissionMap_1[sub.assignment._id] = sub;
                                }
                            });
                            courseMap_1 = {};
                            (aData.assignments || []).forEach(function (a) {
                                if (typeof a === 'object' &&
                                    a !== null &&
                                    'course' in a &&
                                    typeof a.course === 'object' &&
                                    a.course !== null &&
                                    '_id' in a.course &&
                                    '_id' in a) {
                                    var c = a.course;
                                    if (!courseMap_1[c._id])
                                        courseMap_1[c._id] = { obtained: 0, possible: 0 };
                                    var submission = submissionMap_1[a._id];
                                    if (submission && typeof submission.grade === 'number') {
                                        courseMap_1[c._id].obtained += submission.grade;
                                    }
                                    courseMap_1[c._id].possible += a.maxPoints;
                                }
                            });
                            (qData.submissions || []).forEach(function (q) {
                                if (typeof q === 'object' &&
                                    q !== null &&
                                    'quiz' in q &&
                                    typeof q.quiz === 'object' &&
                                    q.quiz !== null &&
                                    'course' in q.quiz &&
                                    q.quiz.course &&
                                    '_id' in q.quiz.course &&
                                    'score' in q &&
                                    'maxScore' in q) {
                                    var c = q.quiz.course;
                                    if (!courseMap_1[c._id])
                                        courseMap_1[c._id] = { obtained: 0, possible: 0 };
                                    courseMap_1[c._id].obtained += q.score;
                                    courseMap_1[c._id].possible += q.maxScore;
                                }
                            });
                            totalObtained_1 = 0, totalPossible_1 = 0;
                            Object.values(courseMap_1).forEach(function (c) {
                                totalObtained_1 += c.obtained;
                                totalPossible_1 += c.possible;
                            });
                            if (totalPossible_1 === 0) {
                                setOverallGrade('N/A');
                                return [2 /*return*/];
                            }
                            avg = Math.round((totalObtained_1 / totalPossible_1) * 100);
                            grade = 'F';
                            if (avg >= 80)
                                grade = 'A';
                            else if (avg >= 70)
                                grade = 'B';
                            else if (avg >= 60)
                                grade = 'C';
                            else if (avg >= 50)
                                grade = 'D';
                            setOverallGrade(grade);
                            return [3 /*break*/, 8];
                        case 7:
                            _a = _b.sent();
                            setOverallGrade('N/A');
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
        fetchOverallGrade();
    }, []);
    var _e = useState([]), recentSubmissions = _e[0], setRecentSubmissions = _e[1];
    var _f = useState(true), loadingStats = _f[0], setLoadingStats = _f[1];
    var _g = useState(true), loadingSubmissions = _g[0], setLoadingSubmissions = _g[1];
    var _h = useState(false), isMobileMenuOpen = _h[0], setIsMobileMenuOpen = _h[1];
    var _j = useState([]), notifications = _j[0], setNotifications = _j[1];
    var _k = useState(false), showNotifications = _k[0], setShowNotifications = _k[1];
    var _l = useState(false), loadingNotifications = _l[0], setLoadingNotifications = _l[1];
    var notificationDropdownRef = useRef(null);
    useEffect(function () {
        if (!loading && (!user || user.role !== 'student')) {
            router.push('/auth/login');
        }
        else if (user && user.role === 'student') {
            fetchStats();
            fetchRecentSubmissions();
            fetchNotifications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, router]);
    // Fetch notifications (announcements, assignments, quizzes, student-specific)
    var fetchNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, ann, assigns, quizzes, quizCreated, all, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoadingNotifications(true);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/student/notifications', {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()
                        // Flatten and tag notifications
                    ];
                case 2:
                    data = _a.sent();
                    ann = (data.announcements || []).map(function (a) {
                        if (typeof a === 'object' &&
                            a !== null &&
                            '_id' in a &&
                            'title' in a &&
                            'message' in a &&
                            'createdAt' in a) {
                            return {
                                _id: a._id,
                                type: 'announcement',
                                title: a.title,
                                message: a.message,
                                createdAt: a.createdAt,
                                course: a.course,
                                teacher: a.teacher, // Ensure teacher is included if available
                            };
                        }
                        return {
                            _id: '',
                            type: 'announcement',
                            title: '',
                            message: '',
                            createdAt: '',
                            course: null,
                            teacher: null,
                        };
                    });
                    assigns = (data.assignments || []).map(function (a) {
                        if (typeof a === 'object' &&
                            a !== null &&
                            '_id' in a &&
                            'title' in a &&
                            'dueDate' in a &&
                            'createdAt' in a &&
                            'course' in a) {
                            return {
                                _id: a._id,
                                type: 'assignment',
                                title: a.title,
                                dueDate: a.dueDate,
                                createdAt: a.createdAt,
                                course: a.course,
                            };
                        }
                        return {
                            _id: '',
                            type: 'assignment',
                            title: '',
                            dueDate: '',
                            createdAt: '',
                            course: null,
                        };
                    });
                    quizzes = (data.quizzes || []).map(function (q) {
                        if (typeof q === 'object' &&
                            q !== null &&
                            '_id' in q &&
                            'title' in q &&
                            'dueDate' in q &&
                            'createdAt' in q &&
                            'course' in q) {
                            return {
                                _id: q._id,
                                type: 'quiz',
                                title: q.title,
                                dueDate: q.dueDate,
                                createdAt: q.createdAt,
                                course: q.course,
                            };
                        }
                        return {
                            _id: '',
                            type: 'quiz',
                            title: '',
                            dueDate: '',
                            createdAt: '',
                            course: null,
                        };
                    });
                    quizCreated = (data.studentNotifications || []).map(function (n) {
                        var notif = n;
                        return {
                            _id: notif._id,
                            type: 'quiz',
                            title: notif.content || 'New Quiz',
                            createdAt: notif.createdAt,
                            course: null,
                        };
                    });
                    all = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], ann, true), assigns, true), quizzes, true), quizCreated, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
                    setNotifications(all);
                    return [3 /*break*/, 4];
                case 3:
                    setNotifications([]);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    setNotifications([]);
                    return [3 /*break*/, 7];
                case 6:
                    setLoadingNotifications(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Clear notifications (simulate)
    var clearNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingNotifications(true);
                    return [4 /*yield*/, fetch('/api/student/notifications', { method: 'DELETE' })];
                case 1:
                    _a.sent();
                    setNotifications([]);
                    setShowNotifications(false);
                    setLoadingNotifications(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Close dropdown on outside click
    useEffect(function () {
        function handleClickOutside(event) {
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, [showNotifications]);
    // Fetch recent submissions for the student
    var fetchRecentSubmissions = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoadingSubmissions(true);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/student/submissions?limit=5', {
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
                    setRecentSubmissions(data.submissions || []);
                    return [3 /*break*/, 4];
                case 3:
                    setRecentSubmissions([]);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_2 = _a.sent();
                    setRecentSubmissions([]);
                    return [3 /*break*/, 7];
                case 6:
                    setLoadingSubmissions(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var fetchStats = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/student/stats', {
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
                    setStats(data);
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Failed to fetch student stats');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error fetching student stats:', error_3);
                    return [3 /*break*/, 7];
                case 6:
                    setLoadingStats(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        logout();
        router.push('/auth/login');
    };
    var toggleMobileMenu = function () {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    var closeMobileMenu = function () {
        setIsMobileMenuOpen(false);
    };
    // Main dashboard features (shown as quick actions)
    var dashboardFeatures = [
        { name: 'My Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Assignments', href: '/student/assignments', icon: FileText },
        { name: 'Quizzes', href: '/student/quizzes', icon: PenTool },
        { name: 'Gradebook', href: '/student/grades', icon: BarChart3 },
        { name: 'Calendar', href: '/student/calendar', icon: Calendar },
    ];
    // Secondary navigation (put under menu/profile dropdown)
    var menuItems = [
        { name: 'Profile', href: '/student/profile', icon: User },
        { name: 'Settings', href: '/student/settings', icon: Settings },
        { name: 'Help & Support', href: '/student/help', icon: HelpCircle },
    ];
    // Enforce PIN change on first login
    useEffect(function () {
        if (!loading && user && user.role === 'student' && user.firstLogin) {
            // Redirect to profile page with forcePinChange param
            router.replace('/student/profile?forcePinChange=1');
        }
    }, [user, loading, router]);
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    // Block dashboard if firstLogin is true
    if (!user || user.role !== 'student' || user.firstLogin) {
        return null;
    }
    // Fallback for user.name to avoid undefined errors
    var displayName = (user === null || user === void 0 ? void 0 : user.name) || 'Student';
    return (<div className="relative">
      {/* Side Slide Profile Panel - render at top level to avoid stacking context issues */}
      {showProfilePanel && (<div className="fixed inset-0 z-[120] flex">
          {/* Overlay */}
          <div className="fixed inset-0 z-[121] bg-black bg-opacity-30 transition-opacity duration-300" onClick={function () { return setShowProfilePanel(false); }}/>
          {/* Slide Panel */}
          <div className="fixed right-0 top-0 z-[122] h-full w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform translate-x-0 transition-transform duration-300 flex flex-col">
            <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700" onClick={function () { return setShowProfilePanel(false); }} aria-label="Close profile panel">
              <X className="h-6 w-6"/>
            </button>
            <div className="flex-1 overflow-y-auto">
              <StudentProfilePanel />
            </div>
          </div>
        </div>)}
      <div className="bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between py-2 gap-2 w-full">
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile hamburger menu */}
                <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (<X className="h-6 w-6" aria-hidden="true"/>) : (<Menu className="h-6 w-6" aria-hidden="true"/>)}
                </button>
                <GraduationCap className="h-9 w-9 text-blue-600 dark:text-blue-400 drop-shadow"/>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">EduSphere</h1>
              </div>
              {/* Right: Actions */}
              <div className="flex items-center gap-2 md:gap-4 ml-auto">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-blue-300 shadow hover:scale-105 transition-transform relative" onClick={function () { return setShowNotifications(function (v) { return !v; }); }} aria-label="Show notifications">
                    <Bell className="h-6 w-6"/>
                    {notifications.length > 0 && (<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow">
                        {notifications.length}
                      </span>)}
                  </button>
                  {/* Dropdown */}
                  {showNotifications && (<div ref={notificationDropdownRef} className="fixed inset-x-0 top-16 mx-2 w-auto max-w-md sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 z-[9999] animate-fade-in">
                      <div className="flex items-center justify-between px-5 py-3 border-b dark:border-gray-800">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Notifications</span>
                        <button onClick={clearNotifications} className="text-xs text-blue-600 hover:underline disabled:opacity-50" disabled={loadingNotifications || notifications.length === 0}>Clear All</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                        {loadingNotifications ? (<div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>) : notifications.length === 0 ? (<div className="py-8 text-center text-gray-400 dark:text-gray-500">No notifications.</div>) : (<ul>
                            {notifications.map(function (n) { return (<li key={n._id} className="px-5 py-4 flex items-start gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors">
                                <div className="flex-shrink-0 mt-1">
                                  {n.type === 'announcement' && <Bell className="h-6 w-6 text-blue-500"/>}
                                  {n.type === 'assignment' && <FileText className="h-6 w-6 text-orange-500"/>}
                                  {n.type === 'quiz' && <PenTool className="h-6 w-6 text-purple-500"/>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white text-base break-words whitespace-pre-line">{n.title}</span>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5 ml-2">{n.type.charAt(0).toUpperCase() + n.type.slice(1)}</span>
                                  </div>
                                  {n.type === 'announcement' && (<p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">{n.message}</p>)}
                                  {n.type === 'assignment' && (<p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">Assignment due {n.dueDate ? new Date(n.dueDate).toLocaleString() : ''}</p>)}
                                  {n.type === 'quiz' && (<p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">
                                      Quiz due {typeof n.dueDate === 'string' || typeof n.dueDate === 'number' ? new Date(n.dueDate).toLocaleString() : ''}
                                    </p>)}
                                  {n.course && typeof n.course === 'object' && 'title' in n.course && (<p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-line">
                                      Course: {typeof n.course.title === 'string' ? n.course.title : ''}
                                    </p>)}
                                  <p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-line">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                                </div>
                              </li>); })}
                          </ul>)}
                      </div>
                    </div>)}
                </div>
                {/* Theme Toggle */}
                <button onClick={toggleTheme} className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-gray-800 dark:text-yellow-300 shadow hover:scale-105 transition-transform" title="Toggle theme">
                  <Sun className="h-5 w-5 block dark:hidden"/>
                  <Moon className="h-5 w-5 hidden dark:block"/>
                </button>
                {/* User Profile Avatar */}
                <div className="relative">
                  <button className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow text-white text-lg font-bold border-2 border-white dark:border-gray-900" aria-label="Open profile panel" onClick={function () { return setShowProfilePanel(true); }}>
                    {displayName.charAt(0).toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* ...rest of dashboard content... */}
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (<div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-40" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-900 shadow-2xl rounded-r-2xl">
            <div className="flex items-center justify-between px-5 py-5 border-b dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button onClick={closeMobileMenu} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <X className="h-6 w-6"/>
              </button>
            </div>
            <nav className="mt-4">
              {/* Dashboard quick links for mobile */}
              {dashboardFeatures.map(function (item) { return (<Link key={item.name} href={item.href} onClick={closeMobileMenu} className="flex items-center px-5 py-4 text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl">
                  <item.icon className="h-5 w-5 mr-3"/>
                  {item.name}
                </Link>); })}
              {/* Secondary menu items */}
              <div className="border-t dark:border-gray-800 mt-4 pt-4">
                {menuItems.map(function (item) { return (<Link key={item.name} href={item.href} onClick={closeMobileMenu} className="flex items-center px-5 py-4 text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl">
                    <item.icon className="h-5 w-5 mr-3"/>
                    {item.name}
                  </Link>); })}
                <button onClick={handleLogout} className="flex items-center w-full px-5 py-4 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors rounded-xl">
                  <LogOut className="h-5 w-5 mr-3"/>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>)}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome back, {displayName}!</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">Here's your learning progress and upcoming tasks.</p>
          </div>
          <div className="hidden md:flex gap-1 md:gap-2 flex-wrap">
            {dashboardFeatures.map(function (item) { return (<Link key={item.name} href={item.href} className="inline-flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-blue-100 dark:bg-gray-800 shadow hover:scale-105 transition-transform group" title={item.name}>
                <item.icon className="h-6 w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform"/>
                <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
              </Link>); })}
          </div>
        </div>

        {/* Stats & Urgent Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-6">
          {/* Stats Card */}
          <div className="col-span-1 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 md:gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your Stats</h3>
            <div className="grid grid-cols-2 gap-1 md:gap-2">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.enrolledCourses}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Courses</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.pendingAssignments}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assignments</span>
              </div>
              <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.upcomingQuizzes}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quizzes</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400 mb-1"/>
                <span className={'text-2xl font-bold ' +
            (overallGrade === 'A' ? 'text-green-500' :
                overallGrade === 'B' ? 'text-blue-500' :
                    overallGrade === 'C' ? 'text-yellow-500' :
                        overallGrade === 'D' ? 'text-orange-500' :
                            overallGrade === 'F' ? 'text-red-500' : 'text-gray-900 dark:text-white')}>
                  {loadingStats ? <span className='animate-pulse'>...</span> : overallGrade}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall Grade</span>
              </div>
            </div>
          </div>
          {/* Urgent Tasks Card */}
          <div className="col-span-2 bg-red-50 rounded-2xl shadow-xl border dark:bg-gray-800 dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 md:gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-500"/> Urgent Tasks</h3>
            {stats.pendingAssignments > 0 || stats.upcomingQuizzes > 0 ? (<div className="flex flex-col gap-4">
                {stats.pendingAssignments > 0 && (<div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400"/>
                    <div>
                      <p className="text-base font-semibold text-red-800 dark:text-red-200">
                        {stats.pendingAssignments} pending assignment{stats.pendingAssignments > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">Review and submit your work</p>
                    </div>
                  </div>)}
                {stats.upcomingQuizzes > 0 && (<div className="flex items-center gap-2 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400"/>
                    <div>
                      <p className="text-base font-semibold text-purple-800 dark:text-purple-200">
                        {stats.upcomingQuizzes} upcoming quiz{stats.upcomingQuizzes > 1 ? 'zes' : ''}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Prepare for your tests</p>
                    </div>
                  </div>)}
              </div>) : (<div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-12 w-12 mb-3 text-green-400 dark:text-green-500"/>
                <p className="text-base font-semibold">Great! No urgent tasks.</p>
                <p className="text-xs mt-1">You're all caught up with your assignments and quizzes.</p>
              </div>)}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {/* Recent Submissions */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Recent Submissions</h3>
            {loadingSubmissions ? (<div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <div className="h-12 w-12 mb-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"/>
                <p className="text-base">Loading...</p>
              </div>) : recentSubmissions.length === 0 ? (<div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600"/>
                <p className="text-base">No recent submissions.</p>
                <p className="text-xs mt-1">Your assignment submissions will appear here.</p>
              </div>) : (<ul className="divide-y divide-gray-100 dark:divide-gray-800 min-w-[220px]">
                {recentSubmissions.map(function (submission) {
                var _a, _b, _c, _d;
                var sub = submission;
                // Use isGraded from backend, fallback to grade presence
                var isGraded = sub.isGraded !== undefined ? sub.isGraded : (sub.grade !== undefined && sub.grade !== null);
                return (<li key={sub._id} className="py-4 flex items-center justify-between gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl transition-colors">
                      <Link href={((_a = sub.assignment) === null || _a === void 0 ? void 0 : _a._id) ? "/student/assignments/".concat(sub.assignment._id) : '#'} className="flex-1 group">
                        <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:underline">
                          {((_b = sub.assignment) === null || _b === void 0 ? void 0 : _b.title) || 'Untitled Assignment'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {((_d = (_c = sub.assignment) === null || _c === void 0 ? void 0 : _c.course) === null || _d === void 0 ? void 0 : _d.title) ? "Course: ".concat(sub.assignment.course.title) : ''}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                        </p>
                      </Link>
                      <div>
                        <span className={"inline-block px-3 py-1 text-xs rounded-full font-semibold ".concat(isGraded ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400')}>
                          {isGraded ? 'Graded' : 'Submitted'}
                        </span>
                      </div>
                    </li>);
            })}
              </ul>)}
          </div>
          {/* Announcements */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Announcements</h3>
            {notifications.filter(function (n) { return n.type === 'announcement'; }).length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                <Bell className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600"/>
                <p className="text-base">No recent announcements.</p>
                <p className="text-xs mt-1">Course announcements will appear here.</p>
              </div>) : (<ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.filter(function (n) { return n.type === 'announcement'; }).map(function (n) {
                var _a;
                return (<li key={n._id} className="py-4 flex items-start gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl transition-colors">
                    <Link href={n.course && typeof n.course === 'object' && '_id' in n.course ? "/student/courses/".concat(n.course._id, "/announcements") : '#'} className="flex-1 group">
                      <div className="flex items-center gap-2">
                        <Bell className="h-6 w-6 text-blue-500"/>
                        <span className="font-semibold text-gray-900 dark:text-white text-base group-hover:underline">{n.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{n.message}</p>
                      {n.course && typeof n.course === 'object' && 'title' in n.course && (<p className="text-xs text-gray-400 mt-1">Course: {n.course.title}</p>)}
                      {((_a = n.teacher) === null || _a === void 0 ? void 0 : _a.name) && (<p className="text-xs text-gray-400 mt-1">By: {n.teacher.name}</p>)}
                      <p className="text-xs text-gray-400 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                    </Link>
                  </li>);
            })}
              </ul>)}
          </div>
        </div>
      </main>
    </div>);
}

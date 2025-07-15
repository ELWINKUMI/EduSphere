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
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpen, GraduationCap, Users, FileText, Bell, BarChart, Clock, RotateCcw, Sun, Moon } from 'lucide-react';
import ProfileMenu from '@/components/teacher/ProfileMenu';
import Notifications from '@/components/teacher/Notifications';
import StudentManagement from '@/components/teacher/StudentManagement';
import SubjectManagement from '@/components/teacher/SubjectManagement';
import AssignmentManagement from '@/components/teacher/AssignmentManagement';
import AnnouncementManagement from '@/components/teacher/AnnouncementManagement'; // <-- Added import
export default function TeacherDashboard() {
    var _this = this;
    var _a = useAuth(), user = _a.user, loading = _a.loading, logout = _a.logout;
    var _b = useTheme(), isDark = _b.isDark, toggleTheme = _b.toggleTheme;
    var router = useRouter();
    var _c = useState({
        totalCourses: 0,
        totalStudents: 0,
        pendingAssignments: 0,
        todayQuizzes: 0
    }), stats = _c[0], setStats = _c[1];
    var _d = useState([]), recentAssignments = _d[0], setRecentAssignments = _d[1];
    var _e = useState(true), loadingStats = _e[0], setLoadingStats = _e[1];
    var _f = useState(null), navigatingTo = _f[0], setNavigatingTo = _f[1];
    var _g = useState(false), processingOverdue = _g[0], setProcessingOverdue = _g[1];
    useEffect(function () {
        if (!loading && (!user || user.role !== 'teacher')) {
            router.push('/auth/login');
        }
        else if (user && user.role === 'teacher') {
            fetchStats();
        }
    }, [user, loading, router]);
    // Auto-refresh stats when page comes into focus
    useEffect(function () {
        var handleFocus = function () {
            if (user && user.role === 'teacher') {
                fetchStats();
                setNavigatingTo(null); // Reset navigation state
            }
        };
        var handleVisibilityChange = function () {
            if (document.visibilityState === 'visible' && user && user.role === 'teacher') {
                setNavigatingTo(null); // Reset navigation state when page becomes visible
            }
        };
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);
    var fetchStats = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, statsResponse, statsData, assignmentsResponse, assignmentsData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingStats(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/stats', {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 2:
                    statsResponse = _a.sent();
                    if (!statsResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, statsResponse.json()];
                case 3:
                    statsData = _a.sent();
                    setStats(statsData);
                    _a.label = 4;
                case 4: return [4 /*yield*/, fetch('/api/teacher/recent-assignments', {
                        headers: {
                            'Authorization': "Bearer ".concat(token)
                        }
                    })];
                case 5:
                    assignmentsResponse = _a.sent();
                    if (!assignmentsResponse.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, assignmentsResponse.json()];
                case 6:
                    assignmentsData = _a.sent();
                    setRecentAssignments(assignmentsData.assignments);
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error fetching dashboard data:', error_1);
                    return [3 /*break*/, 10];
                case 9:
                    setLoadingStats(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        logout();
        toast.success('Logged out successfully');
        router.push('/auth/login');
    };
    var handleQuickAction = function (href, title) { return __awaiter(_this, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            setNavigatingTo(href);
            // Show immediate feedback
            toast.loading("Opening ".concat(title, "..."), {
                id: "nav-".concat(href),
                duration: 1000
            });
            button = document.activeElement;
            if (button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(function () {
                    if (button)
                        button.style.transform = '';
                }, 150);
            }
            // Navigate after a brief moment to show loading state
            setTimeout(function () {
                router.push(href);
            }, 200);
            return [2 /*return*/];
        });
    }); };
    var processOverdueAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProcessingOverdue(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/assignments/process-overdue', {
                            method: 'POST',
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
                    toast.success("Processed ".concat(data.processedAssignments, " overdue assignments. Created ").concat(data.createdSubmissions, " zero-grade submissions."));
                    // Refresh stats to reflect changes
                    fetchStats();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _a.sent();
                    toast.error(error.error || 'Failed to process overdue assignments');
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error processing overdue assignments:', error_2);
                    toast.error('Error processing overdue assignments');
                    return [3 /*break*/, 9];
                case 8:
                    setProcessingOverdue(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    if (!user || user.role !== 'teacher') {
        return null;
    }
    var quickActions = [
        {
            title: 'Create Subject',
            description: 'Setup a new subject',
            icon: <BookOpen className="h-6 w-6"/>,
            href: '/teacher/subjects/create',
            color: 'bg-blue-500'
        },
        {
            title: 'New Assignment',
            description: 'Create assignment',
            icon: <FileText className="h-6 w-6"/>,
            href: '/teacher/assignments/create',
            color: 'bg-green-500'
        },
        {
            title: 'New Quiz',
            description: 'Create a quiz',
            icon: <Clock className="h-6 w-6"/>,
            href: '/teacher/quizzes/create',
            color: 'bg-purple-500'
        },
        {
            title: 'Quiz Analytics',
            description: 'View quiz results',
            icon: <BarChart className="h-6 w-6"/>,
            href: '/teacher/quizzes',
            color: 'bg-purple-600'
        },
        {
            title: 'Announcement',
            description: 'Post announcement',
            icon: <Bell className="h-6 w-6"/>,
            href: '/teacher/announcements/create',
            color: 'bg-orange-500'
        },
        {
            title: 'View Submissions',
            description: 'Review & grade',
            icon: <Users className="h-6 w-6"/>,
            href: '/teacher/submissions',
            color: 'bg-indigo-500'
        },
        {
            title: 'Process Overdue',
            description: 'Auto-grade missed assignments',
            icon: <RotateCcw className="h-6 w-6"/>,
            action: processOverdueAssignments,
            color: 'bg-red-500',
            isLoading: processingOverdue
        }
    ];
    return (<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <GraduationCap className="h-9 w-9 text-blue-600 dark:text-blue-400 drop-shadow"/>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">EduSphere</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={fetchStats} disabled={loadingStats} className="p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 hover:scale-105 transition-transform" title="Refresh stats">
                <RotateCcw className={"h-6 w-6 ".concat(loadingStats ? 'animate-spin' : '')}/>
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-yellow-100 dark:bg-gray-800 text-yellow-600 dark:text-yellow-300 hover:scale-105 transition-transform" title="Toggle theme">
                <Sun className="h-5 w-5 block dark:hidden"/>
                <Moon className="h-5 w-5 hidden dark:block"/>
              </button>
              <Notifications />
              {/* Profile menu with avatar and dropdown */}
              <ProfileMenu name={user.name} onLogout={handleLogout}/>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-4 md:py-8">
        {/* Quick Actions */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {quickActions.map(function (action, idx) { return (<button key={action.title} onClick={function () { return action.href ? handleQuickAction(action.href, action.title) : action.action && action.action(); }} className={"flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200 ".concat(action.color, " ").concat(action.isLoading ? 'opacity-60 pointer-events-none' : '')} disabled={!!action.isLoading}>
              <span className="text-white p-3 rounded-full bg-black/10 mb-2">{action.icon}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{action.title}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{action.description}</span>
              {action.isLoading && <span className="text-xs text-gray-400 mt-2">Processing...</span>}
            </button>); })}
        </div>

        {/* Stats & Recent Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {/* Stats Card */}
          <div className="col-span-1 bg-white/90 dark:bg-gray-900/90 rounded-2xl border dark:border-gray-800 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Dashboard Stats</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.totalCourses}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Courses</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.totalStudents}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Students</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.pendingAssignments}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending Assignments</span>
              </div>
              <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-1"/>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.todayQuizzes}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Today's Quizzes</span>
              </div>
            </div>
          </div>
          {/* Recent Assignments Card */}
          <div className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-500"/> Recent Assignments</h3>
            {recentAssignments.length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600"/>
                <p className="text-base">No recent assignments.</p>
                <p className="text-xs mt-1">Assignments you create will appear here.</p>
              </div>) : (<ul className="divide-y divide-gray-100 dark:divide-gray-800 min-w-[320px]">
                {recentAssignments.map(function (assignment) { return (<li key={assignment.id} className="py-4 flex items-center justify-between gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl transition-colors">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Course: {assignment.course}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {assignment.due ? assignment.due : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {assignment.submissions} Submissions
                      </span>
                    </div>
                  </li>); })}
              </ul>)}
          </div>
        </div>

        {/* Subject Management */}
        <div className="mb-8 overflow-x-auto">
          <SubjectManagement />
        </div>

        {/* Assignment Management */}
        <div className="mb-8 overflow-x-auto">
          <AssignmentManagement />
        </div>

        {/* Student Management */}
        <div className="mb-8 overflow-x-auto">
          <StudentManagement />
        </div>

        {/* Announcement Management */}
        <div className="mb-8 overflow-x-auto">
          <AnnouncementManagement />
        </div>

      </main>
    </div>);
}

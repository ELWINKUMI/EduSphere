'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
// Lazy load the profile page for the side panel
const StudentProfilePanel = dynamic(() => import('../profile/page'), { ssr: false })
import {
  BookOpen,
  FileText,
  Calendar,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
  TrendingUp,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Home,
  User,
  Settings,
  HelpCircle,
  GraduationCap,
  PenTool,
  BarChart3
} from 'lucide-react'

interface StudentStats {
  enrolledCourses: number
  pendingAssignments: number
  upcomingQuizzes: number
  overallGrade: string
}

export default function StudentDashboard() {
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const { user, loading, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState<StudentStats>({
    enrolledCourses: 0,
    pendingAssignments: 0,
    upcomingQuizzes: 0,
    overallGrade: 'N/A',
  });
  const [overallGrade, setOverallGrade] = useState<string>('N/A');
  // Fetch overall grade from gradebook
  useEffect(() => {
    async function fetchOverallGrade() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const aRes = await fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } });
        const aData = await aRes.json();
        const sRes = await fetch('/api/submissions', { headers: { Authorization: `Bearer ${token}` } });
        const sData = await sRes.json();
        const qRes = await fetch('/api/quiz-submissions', { headers: { Authorization: `Bearer ${token}` } });
        const qData = await qRes.json();
        // Map assignmentId to submission (for actual scores)
        const submissionMap: Record<string, unknown> = {};
        (sData.submissions || []).forEach((sub: unknown) => {
          if (
            typeof sub === 'object' &&
            sub !== null &&
            'assignment' in sub &&
            typeof (sub as any).assignment === 'object' &&
            (sub as any).assignment !== null &&
            '_id' in (sub as any).assignment
          ) {
            submissionMap[(sub as any).assignment._id] = sub;
          }
        });
        // Group by course
        const courseMap: Record<string, { obtained: number, possible: number } > = {};
        (aData.assignments || []).forEach((a: unknown) => {
          if (
            typeof a === 'object' &&
            a !== null &&
            'course' in a &&
            typeof (a as any).course === 'object' &&
            (a as any).course !== null &&
            '_id' in (a as any).course &&
            '_id' in (a as any)
          ) {
            const c = (a as any).course;
            if (!courseMap[c._id]) courseMap[c._id] = { obtained: 0, possible: 0 };
            const submission = submissionMap[(a as any)._id];
            if (submission && typeof (submission as any).grade === 'number') {
              courseMap[c._id].obtained += (submission as any).grade;
            }
            courseMap[c._id].possible += (a as any).maxPoints;
          }
        });
        (qData.submissions || []).forEach((q: unknown) => {
          if (
            typeof q === 'object' &&
            q !== null &&
            'quiz' in q &&
            typeof (q as any).quiz === 'object' &&
            (q as any).quiz !== null &&
            'course' in (q as any).quiz &&
            (q as any).quiz.course &&
            '_id' in (q as any).quiz.course &&
            'score' in q &&
            'maxScore' in q
          ) {
            const c = (q as any).quiz.course;
            if (!courseMap[c._id]) courseMap[c._id] = { obtained: 0, possible: 0 };
            courseMap[c._id].obtained += (q as any).score;
            courseMap[c._id].possible += (q as any).maxScore;
          }
        });
        // Calculate overall
        let totalObtained = 0, totalPossible = 0;
        Object.values(courseMap).forEach(c => {
          totalObtained += c.obtained;
          totalPossible += c.possible;
        });
        if (totalPossible === 0) {
          setOverallGrade('N/A');
          return;
        }
        const avg = Math.round((totalObtained / totalPossible) * 100);
        let grade = 'F';
        if (avg >= 80) grade = 'A';
        else if (avg >= 70) grade = 'B';
        else if (avg >= 60) grade = 'C';
        else if (avg >= 50) grade = 'D';
        setOverallGrade(grade);
      } catch {
        setOverallGrade('N/A');
      }
    }
    fetchOverallGrade();
  }, []);
  const [recentSubmissions, setRecentSubmissions] = useState<unknown[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Notifications
  interface Notification {
    _id: string;
    type: string;
    title: string;
    message?: string;
    dueDate?: string;
    createdAt: string;
    course?: unknown;
    teacher?: unknown;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/auth/login')
    } else if (user && user.role === 'student') {
      fetchStats()
      fetchRecentSubmissions()
      fetchNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router])

  // Fetch notifications (announcements, assignments, quizzes, student-specific)
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Flatten and tag notifications
        const ann = (data.announcements || []).map((a: unknown) => {
          if (
            typeof a === 'object' &&
            a !== null &&
            '_id' in a &&
            'title' in a &&
            'message' in a &&
            'createdAt' in a
          ) {
            return {
              _id: (a as any)._id,
              type: 'announcement',
              title: (a as any).title,
              message: (a as any).message,
              createdAt: (a as any).createdAt,
              course: (a as any).course,
              teacher: (a as any).teacher, // Ensure teacher is included if available
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
        })
        const assigns = (data.assignments || []).map((a: unknown) => {
          if (
            typeof a === 'object' &&
            a !== null &&
            '_id' in a &&
            'title' in a &&
            'dueDate' in a &&
            'createdAt' in a &&
            'course' in a
          ) {
            return {
              _id: (a as any)._id,
              type: 'assignment',
              title: (a as any).title,
              dueDate: (a as any).dueDate,
              createdAt: (a as any).createdAt,
              course: (a as any).course,
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
        })
        const quizzes = (data.quizzes || []).map((q: unknown) => {
          if (
            typeof q === 'object' &&
            q !== null &&
            '_id' in q &&
            'title' in q &&
            'dueDate' in q &&
            'createdAt' in q &&
            'course' in q
          ) {
            return {
              _id: (q as any)._id,
              type: 'quiz',
              title: (q as any).title,
              dueDate: (q as any).dueDate,
              createdAt: (q as any).createdAt,
              course: (q as any).course,
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
        // Student-specific notifications (e.g., quiz_created)
        const quizCreated = (data.studentNotifications || []).map((n: unknown) => {
          const notif = n as any;
          return {
            _id: notif._id,
            type: 'quiz',
            title: notif.content || 'New Quiz',
            createdAt: notif.createdAt,
            course: null,
          };
        });
        // Sort by createdAt desc
        const all = [...ann, ...assigns, ...quizzes, ...quizCreated].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setNotifications(all)
      } else {
        setNotifications([])
      }
    } catch (error) {
      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }

  // Clear notifications (simulate)
  const clearNotifications = async () => {
    setLoadingNotifications(true)
    await fetch('/api/student/notifications', { method: 'DELETE' })
    setNotifications([])
    setShowNotifications(false)
    setLoadingNotifications(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])
  // Fetch recent submissions for the student
  const fetchRecentSubmissions = async () => {
    try {
      setLoadingSubmissions(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/submissions?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRecentSubmissions(data.submissions || [])
      } else {
        setRecentSubmissions([])
      }
    } catch (error) {
      setRecentSubmissions([])
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/student/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch student stats')
      }
    } catch (error) {
      console.error('Error fetching student stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Main dashboard features (shown as quick actions)
  const dashboardFeatures = [
    { name: 'My Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Assignments', href: '/student/assignments', icon: FileText },
    { name: 'Quizzes', href: '/student/quizzes', icon: PenTool },
    { name: 'Gradebook', href: '/student/grades', icon: BarChart3 },
    { name: 'Calendar', href: '/student/calendar', icon: Calendar },
  ];

  // Secondary navigation (put under menu/profile dropdown)
  const menuItems = [
    { name: 'Profile', href: '/student/profile', icon: User },
    { name: 'Settings', href: '/student/settings', icon: Settings },
    { name: 'Help & Support', href: '/student/help', icon: HelpCircle },
  ]


  // Enforce PIN change on first login
  useEffect(() => {
    if (!loading && user && user.role === 'student' && user.firstLogin) {
      // Redirect to profile page with forcePinChange param
      router.replace('/student/profile?forcePinChange=1');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Block dashboard if firstLogin is true
  if (!user || user.role !== 'student' || user.firstLogin) {
    return null;
  }

  // Fallback for user.name to avoid undefined errors
  const displayName = user?.name || 'Student';

  return (
    <div className="relative">
      {/* Side Slide Profile Panel - render at top level to avoid stacking context issues */}
      {showProfilePanel && (
        <div className="fixed inset-0 z-[120] flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[121] bg-black bg-opacity-30 transition-opacity duration-300"
            onClick={() => setShowProfilePanel(false)}
          />
          {/* Slide Panel */}
          <div className="fixed right-0 top-0 z-[122] h-full w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform translate-x-0 transition-transform duration-300 flex flex-col">
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowProfilePanel(false)}
              aria-label="Close profile panel"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex-1 overflow-y-auto">
              <StudentProfilePanel />
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between py-2 gap-2 w-full">
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile hamburger menu */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                <GraduationCap className="h-9 w-9 text-blue-600 dark:text-blue-400 drop-shadow" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">EduSphere</h1>
              </div>
              {/* Right: Actions */}
              <div className="flex items-center gap-2 md:gap-4 ml-auto">
                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-blue-300 shadow hover:scale-105 transition-transform relative"
                    onClick={() => setShowNotifications((v) => !v)}
                    aria-label="Show notifications"
                  >
                    <Bell className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {/* Dropdown */}
                  {showNotifications && (
                    <div ref={notificationDropdownRef} className="fixed inset-x-0 top-16 mx-2 w-auto max-w-md sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 z-[9999] animate-fade-in">
                      <div className="flex items-center justify-between px-5 py-3 border-b dark:border-gray-800">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Notifications</span>
                        <button onClick={clearNotifications} className="text-xs text-blue-600 hover:underline disabled:opacity-50" disabled={loadingNotifications || notifications.length === 0}>Clear All</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                        {loadingNotifications ? (
                          <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-400 dark:text-gray-500">No notifications.</div>
                        ) : (
                          <ul>
                            {notifications.map((n) => (
                              <li key={n._id} className="px-5 py-4 flex items-start gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors">
                                <div className="flex-shrink-0 mt-1">
                                  {n.type === 'announcement' && <Bell className="h-6 w-6 text-blue-500" />}
                                  {n.type === 'assignment' && <FileText className="h-6 w-6 text-orange-500" />}
                                  {n.type === 'quiz' && <PenTool className="h-6 w-6 text-purple-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white text-base break-words whitespace-pre-line">{n.title}</span>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5 ml-2">{n.type.charAt(0).toUpperCase() + n.type.slice(1)}</span>
                                  </div>
                                  {n.type === 'announcement' && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">{n.message}</p>
                                  )}
                                  {n.type === 'assignment' && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">Assignment due {n.dueDate ? new Date(n.dueDate).toLocaleString() : ''}</p>
                                  )}
                                  {n.type === 'quiz' && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 break-words whitespace-pre-line">
                                      Quiz due {typeof n.dueDate === 'string' || typeof n.dueDate === 'number' ? new Date(n.dueDate).toLocaleString() : ''}
                                    </p>
                                  )}
                                  {n.course && typeof n.course === 'object' && 'title' in n.course && (
                                    <p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-line">
                                      Course: {typeof (n.course as any).title === 'string' ? (n.course as any).title : ''}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-line">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-yellow-100 text-yellow-600 dark:bg-gray-800 dark:text-yellow-300 shadow hover:scale-105 transition-transform"
                  title="Toggle theme"
                >
                  <Sun className="h-5 w-5 block dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </button>
                {/* User Profile Avatar */}
                <div className="relative">
                  <button
                    className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow text-white text-lg font-bold border-2 border-white dark:border-gray-900"
                    aria-label="Open profile panel"
                    onClick={() => setShowProfilePanel(true)}
                  >
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
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-40" onClick={closeMobileMenu}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-900 shadow-2xl rounded-r-2xl">
            <div className="flex items-center justify-between px-5 py-5 border-b dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-4">
              {/* Dashboard quick links for mobile */}
              {dashboardFeatures.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center px-5 py-4 text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              {/* Secondary menu items */}
              <div className="border-t dark:border-gray-800 mt-4 pt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center px-5 py-4 text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-5 py-4 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors rounded-xl"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome back, {displayName}!</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">Here's your learning progress and upcoming tasks.</p>
          </div>
          <div className="hidden md:flex gap-1 md:gap-2 flex-wrap">
            {dashboardFeatures.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-blue-100 dark:bg-gray-800 shadow hover:scale-105 transition-transform group"
                title={item.name}
              >
                <item.icon className="h-6 w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats & Urgent Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-6">
          {/* Stats Card */}
          <div className="col-span-1 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 md:gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your Stats</h3>
            <div className="grid grid-cols-2 gap-1 md:gap-2">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.enrolledCourses}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Courses</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400 mb-1" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.pendingAssignments}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assignments</span>
              </div>
              <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{loadingStats ? <span className='animate-pulse'>...</span> : stats.upcomingQuizzes}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quizzes</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
                <span className={
                  'text-2xl font-bold ' +
                  (overallGrade === 'A' ? 'text-green-500' :
                  overallGrade === 'B' ? 'text-blue-500' :
                  overallGrade === 'C' ? 'text-yellow-500' :
                  overallGrade === 'D' ? 'text-orange-500' :
                  overallGrade === 'F' ? 'text-red-500' : 'text-gray-900 dark:text-white')
                }>
                  {loadingStats ? <span className='animate-pulse'>...</span> : overallGrade}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall Grade</span>
              </div>
            </div>
          </div>
          {/* Urgent Tasks Card */}
          <div className="col-span-2 bg-red-50 rounded-2xl shadow-xl border dark:bg-gray-800 dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 md:gap-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-500" /> Urgent Tasks</h3>
            {stats.pendingAssignments > 0 || stats.upcomingQuizzes > 0 ? (
              <div className="flex flex-col gap-4">
                {stats.pendingAssignments > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-base font-semibold text-red-800 dark:text-red-200">
                        {stats.pendingAssignments} pending assignment{stats.pendingAssignments > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">Review and submit your work</p>
                    </div>
                  </div>
                )}
                {stats.upcomingQuizzes > 0 && (
              <div className="flex items-center gap-2 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-base font-semibold text-purple-800 dark:text-purple-200">
                        {stats.upcomingQuizzes} upcoming quiz{stats.upcomingQuizzes > 1 ? 'zes' : ''}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Prepare for your tests</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-12 w-12 mb-3 text-green-400 dark:text-green-500" />
                <p className="text-base font-semibold">Great! No urgent tasks.</p>
                <p className="text-xs mt-1">You're all caught up with your assignments and quizzes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {/* Recent Submissions */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Recent Submissions</h3>
            {loadingSubmissions ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <div className="h-12 w-12 mb-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <p className="text-base">Loading...</p>
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-base">No recent submissions.</p>
                <p className="text-xs mt-1">Your assignment submissions will appear here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800 min-w-[220px]">
                {recentSubmissions.map((submission) => {
                  const sub = submission as any;
                  // Use isGraded from backend, fallback to grade presence
                  const isGraded = sub.isGraded !== undefined ? sub.isGraded : (sub.grade !== undefined && sub.grade !== null);
                  return (
                    <li key={sub._id} className="py-4 flex items-center justify-between gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl transition-colors">
                      <Link href={sub.assignment?._id ? `/student/assignments/${sub.assignment._id}` : '#'} className="flex-1 group">
                        <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:underline">
                          {sub.assignment?.title || 'Untitled Assignment'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {sub.assignment?.course?.title ? `Course: ${sub.assignment.course.title}` : ''}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                        </p>
                      </Link>
                      <div>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${isGraded ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                          {isGraded ? 'Graded' : 'Submitted'}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          {/* Announcements */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border dark:border-gray-800 p-3 md:p-4 flex flex-col gap-3 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Announcements</h3>
            {notifications.filter((n) => n.type === 'announcement').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                <Bell className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-base">No recent announcements.</p>
                <p className="text-xs mt-1">Course announcements will appear here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.filter((n) => n.type === 'announcement').map((n) => (
                  <li key={n._id} className="py-4 flex items-start gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-xl transition-colors">
                    <Link href={n.course && typeof n.course === 'object' && '_id' in n.course ? `/student/courses/${(n.course as any)._id}/announcements` : '#'} className="flex-1 group">
                      <div className="flex items-center gap-2">
                        <Bell className="h-6 w-6 text-blue-500" />
                        <span className="font-semibold text-gray-900 dark:text-white text-base group-hover:underline">{n.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{n.message}</p>
                      {n.course && typeof n.course === 'object' && 'title' in n.course && (
                        <p className="text-xs text-gray-400 mt-1">Course: {(n.course as any).title}</p>
                      )}
                      {n.teacher?.name && (
                        <p className="text-xs text-gray-400 mt-1">By: {n.teacher.name}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
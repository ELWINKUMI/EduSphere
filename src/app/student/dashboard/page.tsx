'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Moon
} from 'lucide-react'

interface StudentStats {
  enrolledCourses: number
  pendingAssignments: number
  upcomingQuizzes: number
  overallGrade: string
}

export default function StudentDashboard() {
  const { user, loading, logout } = useAuth()
  const { toggleTheme } = useTheme()
  const router = useRouter()
  const [stats, setStats] = useState<StudentStats>({
    enrolledCourses: 0,
    pendingAssignments: 0,
    upcomingQuizzes: 0,
    overallGrade: 'N/A'
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/auth/login')
    } else if (user && user.role === 'student') {
      fetchStats()
    }
  }, [user, loading, router])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'student') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduSphere</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Toggle theme"
              >
                <Sun className="h-5 w-5 block dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Logout</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your learning progress and upcoming tasks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                {loadingStats ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.enrolledCourses}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Assignments</p>
                {loadingStats ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAssignments}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Quizzes</p>
                {loadingStats ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingQuizzes}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Grade</p>
                {loadingStats ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overallGrade}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Urgent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Urgent Tasks */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Urgent Tasks
            </h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No urgent tasks at the moment.</p>
              <p className="text-sm">Complete assignments and quizzes will appear here when deadlines approach.</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Course Progress
            </h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No course progress available.</p>
              <p className="text-sm">Progress tracking will appear here once you're enrolled in courses.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/student/assignments"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Assignments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submit and track assignments</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/student/quizzes"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Take Quizzes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete timed quizzes</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/student/courses"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access course materials</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/student/grades"
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Grades</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check your progress</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Submissions</h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No recent submissions.</p>
              <p className="text-sm">Your assignment submissions will appear here.</p>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No recent announcements.</p>
              <p className="text-sm">Course announcements will appear here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

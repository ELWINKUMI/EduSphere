'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

import {
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Calendar,
  Bell,
  Settings,
  Plus,
  BarChart,
  Clock,
  CheckCircle,
  RotateCcw,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react'
import ProfileMenu from '@/components/teacher/ProfileMenu'
import Notifications from '@/components/teacher/Notifications'
import StudentManagement from '@/components/teacher/StudentManagement'
import SubjectManagement from '@/components/teacher/SubjectManagement'
import AssignmentManagement from '@/components/teacher/AssignmentManagement'
import AnnouncementManagement from '@/components/teacher/AnnouncementManagement'

interface DashboardStats {
  totalCourses: number
  totalStudents: number
  pendingAssignments: number
  todayQuizzes: number
}

interface RecentAssignment {
  id: string
  title: string
  course: string
  due: string
  submissions: number
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  color: string
  isLoading?: boolean
}

export default function TeacherDashboard() {
  const { user, loading, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    todayQuizzes: 0
  })
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
  const [processingOverdue, setProcessingOverdue] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      router.push('/auth/login')
    } else if (user && user.role === 'teacher') {
      fetchStats()
    }
  }, [user, loading, router])

  // Auto-refresh stats when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role === 'teacher') {
        fetchStats()
        setNavigatingTo(null)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && user.role === 'teacher') {
        setNavigatingTo(null)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const token = localStorage.getItem('token')
      
      // Fetch stats
      const statsResponse = await fetch('/api/teacher/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent assignments
      const assignmentsResponse = await fetch('/api/teacher/recent-assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json()
        setRecentAssignments(assignmentsData.assignments)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }

  const handleQuickAction = async (href: string, title: string) => {
    setNavigatingTo(href)
    setShowMobileActions(false) // Close mobile menu
    
    // Show immediate feedback
    toast.loading(`Opening ${title}...`, {
      id: `nav-${href}`,
      duration: 1000
    })
    
    // Immediate visual feedback
    const button = document.activeElement as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        if (button) button.style.transform = ''
      }, 150)
    }
    
    // Navigate after a brief moment to show loading state
    setTimeout(() => {
      router.push(href)
    }, 200)
  }

  const processOverdueAssignments = async () => {
    setProcessingOverdue(true)
    setShowMobileActions(false) // Close mobile menu
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/assignments/process-overdue', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Processed ${data.processedAssignments} overdue assignments. Created ${data.createdSubmissions} zero-grade submissions.`)
        
        // Refresh stats to reflect changes
        fetchStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to process overdue assignments')
      }
    } catch (error) {
      console.error('Error processing overdue assignments:', error)
      toast.error('Error processing overdue assignments')
    } finally {
      setProcessingOverdue(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'teacher') {
    return null
  }

  const quickActions = [
    {
      title: 'Create Subject',
      description: 'Setup a new subject',
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/subjects/create',
      color: 'bg-blue-500'
    },
    {
      title: 'New Assignment',
      description: 'Create assignment',
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/assignments/create',
      color: 'bg-green-500'
    },
    {
      title: 'New Quiz',
      description: 'Create a quiz',
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/quizzes/create',
      color: 'bg-purple-500'
    },
    {
      title: 'Quiz Analytics',
      description: 'View quiz results',
      icon: <BarChart className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/quizzes',
      color: 'bg-purple-600'
    },
    {
      title: 'Announcement',
      description: 'Post announcement',
      icon: <Bell className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/announcements/create',
      color: 'bg-orange-500'
    },
    {
      title: 'View Submissions',
      description: 'Review & grade',
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
      href: '/teacher/submissions',
      color: 'bg-indigo-500'
    },
    {
      title: 'Process Overdue',
      description: 'Auto-grade missed assignments',
      icon: <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />,
      action: processOverdueAssignments,
      color: 'bg-red-500',
      isLoading: processingOverdue
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <GraduationCap className="h-7 w-7 sm:h-9 sm:w-9 text-blue-600 dark:text-blue-400 drop-shadow" />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="hidden sm:inline">EduSphere</span>
                <span className="sm:hidden">Edu</span>
              </h1>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2 md:gap-4">
              <button
                onClick={fetchStats}
                disabled={loadingStats}
                className="p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 hover:scale-105 transition-transform"
                title="Refresh stats"
              >
                <RotateCcw className={`h-5 w-5 md:h-6 md:w-6 ${loadingStats ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-yellow-100 dark:bg-gray-800 text-yellow-600 dark:text-yellow-300 hover:scale-105 transition-transform"
                title="Toggle theme"
              >
                <Sun className="h-4 w-4 md:h-5 md:w-5 block dark:hidden" />
                <Moon className="h-4 w-4 md:h-5 md:w-5 hidden dark:block" />
              </button>
              <Notifications />
              <ProfileMenu name={user.name} onLogout={handleLogout} />
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={fetchStats}
                disabled={loadingStats}
                className="p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300"
                title="Refresh stats"
              >
                <RotateCcw className={`h-5 w-5 ${loadingStats ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-yellow-100 dark:bg-gray-800 text-yellow-600 dark:text-yellow-300"
                title="Toggle theme"
              >
                <Sun className="h-4 w-4 block dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </button>
              <Notifications />
              <ProfileMenu name={user.name} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-4 md:py-8">
        {/* Quick Actions - Mobile Optimized */}
        <div className="mb-6 sm:mb-10">
          {/* Mobile: Show first 4 actions prominently, rest in collapsible */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {quickActions.slice(0, 4).map((action, idx) => (
                <button
                  key={action.title}
                  onClick={() => action.href ? handleQuickAction(action.href, action.title) : action.action && action.action()}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200 ${action.color} ${action.isLoading ? 'opacity-60 pointer-events-none' : ''} min-h-[100px]`}
                  disabled={!!action.isLoading}
                >
                  <span className="text-white p-1.5 rounded-full bg-black/10 mb-0.5">{action.icon}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white text-center leading-tight">{action.title}</span>
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 text-center leading-tight">{action.description}</span>
                  {action.isLoading && <span className="text-[10px] text-gray-400 mt-0.5">Processing...</span>}
                </button>
              ))}
            </div>
            
            {/* Collapsible additional actions */}
            <div className="text-center">
              <button
                onClick={() => setShowMobileActions(!showMobileActions)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <span>{showMobileActions ? 'Show Less' : 'More Actions'}</span>
                {showMobileActions ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
            
            {showMobileActions && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                {quickActions.slice(4).map((action, idx) => (
                  <button
                    key={action.title}
                    onClick={() => action.href ? handleQuickAction(action.href, action.title) : action.action && action.action()}
                    className={`flex items-center gap-4 p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200 ${action.color} ${action.isLoading ? 'opacity-60 pointer-events-none' : ''}`}
                    disabled={!!action.isLoading}
                  >
                    <span className="text-white p-2 rounded-full bg-black/10">{action.icon}</span>
                    <div className="flex-1 text-left">
                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{action.title}</span>
                      <span className="block text-xs text-gray-600 dark:text-gray-300">{action.description}</span>
                      {action.isLoading && <span className="text-xs text-gray-400 mt-1">Processing...</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Regular grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {quickActions.map((action, idx) => (
              <button
                key={action.title}
                onClick={() => action.href ? handleQuickAction(action.href, action.title) : action.action && action.action()}
                className={`flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200 ${action.color} ${action.isLoading ? 'opacity-60 pointer-events-none' : ''} min-h-[140px] md:min-h-[160px]`}
                disabled={!!action.isLoading}
              >
                <span className="text-white p-2 md:p-3 rounded-full bg-black/10 mb-1 md:mb-2">{action.icon}</span>
                <span className="text-xs md:text-lg font-bold text-gray-900 dark:text-white text-center">{action.title}</span>
                <span className="text-[11px] md:text-sm text-gray-600 dark:text-gray-300 text-center">{action.description}</span>
                {action.isLoading && <span className="text-[10px] text-gray-400 mt-2">Processing...</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Stats & Recent Assignments - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 sm:mb-10">
          {/* Stats Card */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-900/90 rounded-xl sm:rounded-2xl border dark:border-gray-800 p-4 md:p-6">
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Dashboard Stats</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {loadingStats ? <span className='animate-pulse'>...</span> : stats.totalCourses}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-center">Courses</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mb-1" />
                <span className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {loadingStats ? <span className='animate-pulse'>...</span> : stats.totalStudents}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-center">Students</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400 mb-1" />
                <span className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {loadingStats ? <span className='animate-pulse'>...</span> : stats.pendingAssignments}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-center">Pending</span>
              </div>
              <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {loadingStats ? <span className='animate-pulse'>...</span> : stats.todayQuizzes}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-center">Today</span>
              </div>
            </div>
          </div>

          {/* Recent Assignments Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border dark:border-gray-800 p-4 md:p-6">
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" /> 
              Recent Assignments
            </h3>
            <div className="overflow-x-auto">
              {recentAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 mb-2 sm:mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm sm:text-base">No recent assignments.</p>
                  <p className="text-xs mt-1">Assignments you create will appear here.</p>
                </div>
              ) : (
                <div className="min-w-[300px]">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 hover:bg-blue-50 dark:hover:bg-gray-800/60 rounded-lg transition-colors">
                        <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {assignment.title}
                          </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            Course: {assignment.course}
                          </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {assignment.due ? assignment.due : 'N/A'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-block px-2 sm:px-3 py-1 text-[11px] rounded-full font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {assignment.submissions} Submissions
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Management Sections - Mobile Optimized */}
        <div className="space-y-6 sm:space-y-8">
          {/* Subject Management */}
          <div className="overflow-x-auto">
            <SubjectManagement />
          </div>

          {/* Assignment Management */}
          <div className="overflow-x-auto">
            <AssignmentManagement />
          </div>


          {/* Student Management */}
          <div className="pb-2">
            <div className="w-full px-1 sm:min-w-[350px] sm:px-0">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Students</h3>
              <StudentManagement />
            </div>
          </div>

          {/* Announcement Management */}
          <div className="overflow-x-auto">
            <AnnouncementManagement />
          </div>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

import {
  BookOpen,
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
  Moon
} from 'lucide-react'
import StudentManagement from '@/components/teacher/StudentManagement'
import SubjectManagement from '@/components/teacher/SubjectManagement'
import AssignmentManagement from '@/components/teacher/AssignmentManagement'
import AnnouncementManagement from '@/components/teacher/AnnouncementManagement' // <-- Added import

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
        setNavigatingTo(null) // Reset navigation state
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && user.role === 'teacher') {
        setNavigatingTo(null) // Reset navigation state when page becomes visible
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
      icon: <BookOpen className="h-6 w-6" />,
      href: '/teacher/subjects/create',
      color: 'bg-blue-500'
    },
    {
      title: 'New Assignment',
      description: 'Create assignment',
      icon: <FileText className="h-6 w-6" />,
      href: '/teacher/assignments/create',
      color: 'bg-green-500'
    },
    {
      title: 'New Quiz',
      description: 'Create a quiz',
      icon: <Clock className="h-6 w-6" />,
      href: '/teacher/quizzes/create',
      color: 'bg-purple-500'
    },
    {
      title: 'Quiz Analytics',
      description: 'View quiz results',
      icon: <BarChart className="h-6 w-6" />,
      href: '/teacher/quizzes',
      color: 'bg-purple-600'
    },
    {
      title: 'Announcement',
      description: 'Post announcement',
      icon: <Bell className="h-6 w-6" />,
      href: '/teacher/announcements/create',
      color: 'bg-orange-500'
    },
    {
      title: 'View Submissions',
      description: 'Review & grade',
      icon: <Users className="h-6 w-6" />,
      href: '/teacher/submissions',
      color: 'bg-indigo-500'
    },
    {
      title: 'Process Overdue',
      description: 'Auto-grade missed assignments',
      icon: <RotateCcw className="h-6 w-6" />,
      action: processOverdueAssignments,
      color: 'bg-red-500',
      isLoading: processingOverdue
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Prefetch links for faster navigation */}
      <div className="hidden">
        {quickActions.filter(action => action.href).map((action, index) => (
          <Link key={`prefetch-${index}`} href={action.href!} prefetch={true}>
            Prefetch {action.title}
          </Link>
        ))}
      </div>

      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>EduSphere</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchStats}
                disabled={loadingStats}
                className={`p-2 disabled:opacity-50 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                title="Refresh stats"
              >
                <RotateCcw className={`h-6 w-6 ${loadingStats ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={toggleTheme}
                className={`p-2 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <button className={`p-2 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                <Bell className="h-6 w-6" />
              </button>
              <button 
                onClick={handleLogout}
                className={`p-2 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user.name}!
          </h2>
          <p className={`mt-2 transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's what's happening in your courses today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Subjects</p>
                <p className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</p>
                <p className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending Reviews</p>
                <p className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.pendingAssignments}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today's Quizzes</p>
                <p className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.todayQuizzes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  if (action.href) {
                    handleQuickAction(action.href, action.title)
                  } else if (action.action) {
                    action.action()
                  }
                }}
                disabled={navigatingTo === action.href || action.isLoading}
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 text-left disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`inline-flex p-3 rounded-full ${action.color} text-white mb-4 transition-transform duration-200 ${(navigatingTo === action.href || action.isLoading) ? 'animate-pulse' : ''}`}>
                  {(navigatingTo === action.href || action.isLoading) ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    action.icon
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {navigatingTo === action.href ? 'Loading...' : action.title}
                </h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Assignments */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
            {loadingStats ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No assignments created yet.</p>
                <p className="text-sm">Create your first assignment to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{assignment.submissions} submissions</p>
                      <p className="text-sm text-gray-600">{assignment.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming events scheduled.</p>
              <p className="text-sm">Events and announcements will appear here.</p>
            </div>
          </div>
        </div>

        {/* Subject Management */}
        <div className="mb-8">
          <SubjectManagement />
        </div>

        {/* Assignment Management */}
        <div className="mb-8">
          <AssignmentManagement />
        </div>

        {/* Student Management */}
        <StudentManagement />

        {/* Announcement Management */}
        <div className="mb-8">
          <AnnouncementManagement />
        </div>

      </main>
    </div>
  )
}
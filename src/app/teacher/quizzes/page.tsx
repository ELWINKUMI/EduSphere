'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, Plus, Clock, Users, Target, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Quiz {
  _id: string
  title: string
  description: string
  course: {
    _id: string
    title: string
    subject: string
    gradeLevel: string
  }
  totalQuestions: number
  timeLimit: number
  attempts: number
  showResults: string
  startDate: string
  endDate: string
  submissions: string[]
  isActive: boolean
  createdAt: string
}

export default function TeacherQuizzesPage() {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role === 'teacher') {
      fetchQuizzes()
    } else if (user && user.role !== 'teacher') {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuizzes(data.quizzes || [])
      } else {
        toast.error('Failed to load quizzes')
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error('Error loading quizzes')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)

    if (now < startDate) return { status: 'upcoming', color: 'blue' }
    if (now > endDate) return { status: 'ended', color: 'gray' }
    return { status: 'active', color: 'green' }
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/teacher/dashboard" 
                className={`mr-4 p-2 hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : ''} rounded-lg transition-colors`}
              >
                <ArrowLeft className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </Link>
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  My Quizzes
                </h1>
                <p className={`transition-colors duration-200 ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Manage and view analytics for your quizzes
                </p>
              </div>
            </div>
            <Link
              href="/teacher/quizzes/create"
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </Link>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className={`transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border'} rounded-xl shadow-sm p-12 text-center`}>
            <Target className={`h-16 w-16 ${isDark ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              No quizzes yet
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Create your first quiz to get started with student assessments.
            </p>
            <Link
              href="/teacher/quizzes/create"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const showDelete = !quiz.course || !quiz.course.subject;
              const handleDelete = async () => {
                if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch(`/api/quizzes/${quiz._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (res.ok) {
                    toast.success('Quiz deleted');
                    setQuizzes(qs => qs.filter(q => q._id !== quiz._id));
                  } else {
                    toast.error('Failed to delete quiz');
                  }
                } catch {
                  toast.error('Failed to delete quiz');
                }
              };
              return (
                <div
                  key={quiz._id}
                  className={`transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border'} rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow`}
                >
                  {/* Quiz Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {quiz.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {quiz.course
                          ? `${quiz.course.subject} - Grade ${quiz.course.gradeLevel}`
                          : 'No course info'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        status.color === 'green' 
                          ? 'bg-green-100 text-green-800'
                          : status.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status.status}
                      </div>
                      {showDelete && (
                        <button
                          onClick={handleDelete}
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {quiz.totalQuestions}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Questions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {quiz.submissions.length}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Submissions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatTime(quiz.timeLimit)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Time Limit
                      </div>
                    </div>
                  </div>

                  {/* Quiz Details */}
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 space-y-1`}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ends: {formatDate(quiz.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <span>
                        Results: {
                          quiz.showResults === 'immediately' ? 'Immediate' :
                          quiz.showResults === 'after-deadline' ? 'After deadline' :
                          'Manual release'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/teacher/quizzes/${quiz._id}/analytics`}
                      className="flex items-center flex-1 justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                    <Link
                      href={`/student/quizzes/${quiz._id}`}
                      className={`flex items-center px-4 py-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-sm`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

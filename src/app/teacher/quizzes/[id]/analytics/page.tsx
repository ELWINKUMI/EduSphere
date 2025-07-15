'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, Target, Clock, TrendingUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Student {
  _id: string
  name: string
}

interface Submission {
  _id: string
  student: Student
  score: number
  maxScore: number
  percentage: number
  timeSpent: number
  submittedAt: string
  isGraded: boolean
}

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
  teacher: {
    _id: string
    name: string
  }
  totalQuestions: number
  timeLimit: number
  maxScore: number
  startDate: string
  endDate: string
  showResults: string
}

interface ScoreData {
  range: string
  count: number
  percentage: number
}

interface Analytics {
  quiz: Quiz
  statistics: {
    totalStudents: number
    totalSubmissions: number
    completionRate: number
    averageScore: number
    scoreDistribution: Record<string, number>
    scoreData: ScoreData[]
  }
  submissions: Submission[]
}

export default function QuizAnalyticsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTeacher, setIsTeacher] = useState(false)

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false)
  const [editEndDate, setEditEndDate] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  // Retake modal state
  const [showRetake, setShowRetake] = useState(false)
  const [retakeTitle, setRetakeTitle] = useState('')
  const [retakeStart, setRetakeStart] = useState('')
  const [retakeEnd, setRetakeEnd] = useState('')
  const [retakeLoading, setRetakeLoading] = useState(false)
  const [allowRetakeForAll, setAllowRetakeForAll] = useState(false)
  const [useNewQuestions, setUseNewQuestions] = useState(false)
  const [newQuestions, setNewQuestions] = useState('') // JSON or text for now

  useEffect(() => {
    if (user && user.role === 'teacher') {
      setIsTeacher(true)
      fetchAnalytics()
    } else if (user && user.role !== 'teacher') {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/quizzes/${params.id}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        // Set editEndDate for modal default
        setEditEndDate(data.quiz?.endDate ? data.quiz.endDate.slice(0, 16) : '')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to load analytics')
        router.push('/teacher/dashboard')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error loading analytics')
      router.push('/teacher/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleEditQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/quizzes/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endDate: editEndDate })
      })
      if (res.ok) {
        toast.success('Quiz due date updated!')
        setShowEdit(false)
        fetchAnalytics()
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to update due date')
      }
    } catch {
      toast.error('Failed to update due date')
    } finally {
      setEditLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 80) return 'text-blue-600 bg-blue-50'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50'
    if (percentage >= 60) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const handleDeleteQuiz = async () => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/quizzes/${params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Quiz deleted');
        router.push('/teacher/quizzes');
      } else {
        toast.error('Failed to delete quiz');
      }
    } catch {
      toast.error('Failed to delete quiz');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
          <Link href="/teacher/dashboard" className="text-purple-600 hover:text-purple-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { quiz, statistics, submissions } = analytics

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/teacher/dashboard" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quiz.title} - Analytics</h1>
              <p className="text-gray-600 mt-1">
                {quiz.course.subject} - Grade {quiz.course.gradeLevel} • {quiz.course.title}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isTeacher && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => setShowEdit(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              Edit Due Date
            </button>
            <button
              onClick={() => setShowRetake(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              Create Retake
            </button>
            <button
              onClick={handleDeleteQuiz}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              Delete Quiz
            </button>
          </div>
        )}
        {/* Retake Quiz Modal */}
        {showRetake && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                onClick={() => setShowRetake(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Create Quiz Retake</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRetakeLoading(true);
                  try {
                    const token = localStorage.getItem('token');
                    let questionsArr = [];
                    if (useNewQuestions && newQuestions.trim()) {
                      try {
                        questionsArr = JSON.parse(newQuestions);
                      } catch {
                        toast.error('Invalid questions JSON');
                        setRetakeLoading(false);
                        return;
                      }
                    }
                    const res = await fetch(`/api/quizzes/${params.id}`, {
                      method: 'PATCH',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        newTitle: retakeTitle,
                        newStartDate: retakeStart,
                        newEndDate: retakeEnd,
                        allowRetakeForAll,
                        useNewQuestions,
                        newQuestions: questionsArr,
                      }),
                    });
                    if (res.ok) {
                      toast.success('Retake quiz created!');
                      setShowRetake(false);
                      fetchAnalytics();
                    } else {
                      const data = await res.json();
                      toast.error(data.message || 'Failed to create retake');
                    }
                  } catch {
                    toast.error('Failed to create retake');
                  } finally {
                    setRetakeLoading(false);
                  }
                }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-700">New Quiz Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 mb-4"
                  value={retakeTitle}
                  onChange={e => setRetakeTitle(e.target.value)}
                  required
                />
                <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded px-2 py-1 mb-4"
                  value={retakeStart}
                  onChange={e => setRetakeStart(e.target.value)}
                  required
                />
                <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded px-2 py-1 mb-4"
                  value={retakeEnd}
                  onChange={e => setRetakeEnd(e.target.value)}
                  required
                  min={retakeStart}
                />
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox mr-2"
                      checked={allowRetakeForAll}
                      onChange={e => setAllowRetakeForAll(e.target.checked)}
                    />
                    Allow all students to take retake (otherwise only those who missed original)
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block font-medium text-gray-700 mb-1">Questions for Retake</label>
                  <div className="flex items-center mb-2">
                    <label className="mr-4 inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio mr-1"
                        checked={!useNewQuestions}
                        onChange={() => setUseNewQuestions(false)}
                      />
                      Use original questions
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio mr-1"
                        checked={useNewQuestions}
                        onChange={() => setUseNewQuestions(true)}
                      />
                      Set new questions (JSON)
                    </label>
                  </div>
                  {useNewQuestions && (
                    <textarea
                      className="w-full border rounded px-2 py-1 mb-2 text-xs font-mono"
                      rows={6}
                      placeholder='Paste questions as JSON array (see docs)'
                      value={newQuestions}
                      onChange={e => setNewQuestions(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRetake(false)}
                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-semibold"
                    disabled={retakeLoading}
                  >
                    {retakeLoading ? 'Creating...' : 'Create Retake'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Due Date Modal */}
        {showEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowEdit(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Quiz Due Date</h2>
              <form onSubmit={handleEditQuiz}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  New Due Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full border rounded px-2 py-1 mb-4"
                  value={editEndDate}
                  onChange={e => setEditEndDate(e.target.value)}
                  required
                  min={quiz.startDate.slice(0, 16)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                    disabled={editLoading}
                  >
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.completionRate}%</p>
                <p className="text-xs text-gray-500">
                  {statistics.totalSubmissions} of {statistics.totalStudents} students
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}%</p>
                <p className="text-xs text-gray-500">
                  Out of {quiz.maxScore} points
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(quiz.timeLimit)}</p>
                <p className="text-xs text-gray-500">
                  {quiz.totalQuestions} questions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalSubmissions}</p>
                <p className="text-xs text-gray-500">
                  Active quiz
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {statistics.scoreData.map((data) => (
                <div key={data.range} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {data.range}%
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-gray-900">{data.count}</span>
                    <span className="text-xs text-gray-500 ml-1">({data.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>

            {statistics.totalSubmissions === 0 && (
              <div className="text-center py-8 text-gray-500">
                No submissions yet
              </div>
            )}
          </div>

          {/* Student Results */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Results</h3>
            
            <div className="max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No submissions yet
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{submission.student.name}</p>
                        <p className="text-sm text-gray-500">
                          Submitted {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(submission.percentage)}`}>
                          {submission.percentage}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {submission.score}/{submission.maxScore} pts
                        </p>
                        {submission.timeSpent && (
                          <p className="text-xs text-gray-500">
                            Time: {formatTime(submission.timeSpent)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{quiz.description || 'No description provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quiz Schedule</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Start:</span> {formatDate(quiz.startDate)}</p>
                <p><span className="font-medium">End:</span> {formatDate(quiz.endDate)}</p>
                <p><span className="font-medium">Results:</span> {
                  quiz.showResults === 'immediately' ? 'Show immediately' :
                  quiz.showResults === 'after-deadline' ? 'Show after deadline' :
                  'Manual release'
                }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
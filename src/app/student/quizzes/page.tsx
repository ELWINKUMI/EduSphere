'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  Timer,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Quiz {
  _id: string
  title: string
  description: string
  timeLimit: number
  attempts: number
  showResults: string
  startDate: string
  endDate: string
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
  isActive: boolean
  questionCount: number
  maxPoints?: number
}

interface QuizSubmission {
  _id: string
  quiz: string
  score: number
  maxScore: number
  submittedAt: string
  timeSpent: number
  attemptNumber: number
}

export default function StudentQuizzesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all')

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchQuizzes()
      fetchSubmissions()
    } else if (user && user.role !== 'student') {
      router.push('/auth/login')
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
    }
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/quiz-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } else {
        console.error('Failed to load quiz submissions')
      }
    } catch (error) {
      console.error('Error fetching quiz submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const isQuizAvailable = (quiz: Quiz) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.isActive
  }

  const getQuizStatus = (quiz: Quiz) => {
    const submission = submissions.find(s => {
      if (!s.quiz) return false;
      if (typeof s.quiz === 'string') return s.quiz === quiz._id;
      if (typeof s.quiz === 'object' && s.quiz !== null && '_id' in s.quiz) {
        return (s.quiz as { _id: string })._id === quiz._id;
      }
      return false;
    });
    const now = new Date();
    const endDate = new Date(quiz.endDate);
    if (submission) {
      return 'completed';
    }
    if (now > endDate) {
      return 'expired';
    }
    if (isQuizAvailable(quiz)) {
      return 'available';
    }
    return 'upcoming';
  };


  // Build a Set of quiz IDs that have at least one submission
  const completedQuizIds = new Set(submissions.map(s => s.quiz));

  const filteredQuizzes = quizzes.filter(quiz => {
    const status = getQuizStatus(quiz);
    switch (filter) {
      case 'available':
        return status === 'available';
      case 'completed': {
        // Only show quizzes that are actually completed (have at least one submission)
        // Use the same logic as the Completed tab count
        const isCompleted = submissions.some(s => {
          if (typeof s.quiz === 'string') return s.quiz === quiz._id;
          if (typeof s.quiz === 'object' && s.quiz !== null && '_id' in s.quiz) {
            return (s.quiz as { _id: string })._id === quiz._id;
          }
          return false;
        });
        return isCompleted;
      }
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'available':
        return <Play className="h-5 w-5 text-blue-500" />
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'available':
        return 'Available'
      case 'expired':
        return 'Expired'
      default:
        return 'Upcoming'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/student/dashboard"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Quizzes</h1>
                <p className="text-gray-600 dark:text-gray-400">Take quizzes and view your results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'available'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Available ({quizzes.filter(q => getQuizStatus(q) === 'available').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Completed ({Array.from(new Set(submissions.map(s => {
                if (typeof s.quiz === 'string') return s.quiz;
                if (typeof s.quiz === 'object' && s.quiz !== null && '_id' in s.quiz) {
                  return (s.quiz as { _id: string })._id;
                }
                return undefined;
              }))).filter(Boolean).length})
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'available' && 'No quizzes available'}
              {filter === 'completed' && 'No completed quizzes'}
              {filter === 'all' && 'No quizzes found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'available' && 'Check back later for new quizzes from your teachers.'}
              {filter === 'completed' && 'Complete some quizzes to see your results here.'}
              {filter === 'all' && 'Your teachers haven\'t created any quizzes yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const status = getQuizStatus(quiz)

              // All submissions for this quiz
              const quizSubmissions = submissions.filter(s => s.quiz === quiz._id);
              const submission = quizSubmissions[quizSubmissions.length - 1]; // latest submission if any
              // Calculate attempts
              const attemptsAllowed = quiz?.attempts ?? 1;
              // Use best.attemptNumber if present, fallback to 1 if there is a submission, else 0
              const best = quizSubmissions.length > 0 ? quizSubmissions.reduce((acc, curr) => curr.score > acc.score ? curr : acc, quizSubmissions[0]) : null;
              const attemptsUsed = best && typeof best.attemptNumber === 'number' ? best.attemptNumber : (quizSubmissions.length > 0 ? 1 : 0);
              const hasAttemptsLeft = attemptsAllowed === 999 || attemptsUsed < attemptsAllowed;

              return (
                <div
                  key={quiz._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className={`ml-2 text-sm font-medium ${
                        status === 'completed' ? 'text-green-700 dark:text-green-400' :
                        status === 'available' ? 'text-blue-700 dark:text-blue-400' :
                        status === 'expired' ? 'text-red-700 dark:text-red-400' :
                        'text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {quiz.course.subject} - Grade {quiz.course.gradeLevel}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Timer className="h-4 w-4 mr-2" />
                      {quiz.timeLimit} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: {new Date(quiz.endDate).toLocaleDateString()}
                    </div>
                    {best && typeof best.attemptNumber === 'number' && attemptsAllowed !== 999 && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        Attempts Used: {best.attemptNumber} / {attemptsAllowed}
                      </div>
                    )}
                  </div>

                  {quizSubmissions.length > 0 && (() => {
                    // Find best submission: highest score, and if tied, lowest timeSpent
                    const best = quizSubmissions.reduce((acc, curr) =>
                      curr.score > acc.score ||
                      (curr.score === acc.score && curr.timeSpent < acc.timeSpent)
                        ? curr
                        : acc, quizSubmissions[0]);
                    return (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-xs text-green-700 dark:text-green-400 font-semibold">
                            Best Score: {best.score}/{best.maxScore}
                          </span>
                          <span className="text-xs text-green-700 dark:text-green-400 font-semibold ml-4">
                            Time Used: {Math.floor(best.timeSpent / 60)}:{(best.timeSpent % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Last Attempt: {new Date(best.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="flex gap-2">
                    {/* Take Quiz button removed as requested */}
                    {quizSubmissions.length > 0 && (
                      <Link
                        href={`/student/quizzes/${quiz._id}/results`}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        View Results
                      </Link>
                    )}
                    <Link
                      href={`/student/quizzes/${quiz._id}`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Details
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
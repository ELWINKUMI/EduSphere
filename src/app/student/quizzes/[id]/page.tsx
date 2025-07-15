// No changes needed. File is already clean and functional.

// No changes needed. File is already clean and functional.
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
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
  Award,
  User,
  FileText
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
  questions: Array<{
    question: string
    type: string
    points: number
  }>
  eligibleStudents?: string[]
}

interface QuizSubmission {
  _id: string
  score: number
  maxScore: number
  submittedAt: string
  timeSpent: number
  attemptNumber: number
}

// Helper to get attempts used from submission or default to 0
function getAttemptsUsed(submission: QuizSubmission | null) {
  return submission?.attemptNumber ?? 0;
}

export default function StudentQuizDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [submission, setSubmission] = useState<any | null>(null)
  const [allQuizSubmissions, setAllQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (quizId && user && user.role === 'student') {
      fetchQuizDetails();
      fetchAllQuizSubmissions();
    } else if (user && user.role !== 'student') {
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, user, router]);

  // Fetch all submissions for this quiz and student
  const fetchAllQuizSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Only keep submissions for this quiz
        const filtered = (data.submissions || []).filter((s: any) => s.quiz && (s.quiz._id === quizId || s.quiz === quizId));
        setAllQuizSubmissions(filtered);
      } else {
        setAllQuizSubmissions([]);
      }
    } catch (error) {
      setAllQuizSubmissions([]);
    }
  };

  const fetchQuizDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQuiz(data.quiz)
        // Patch: ensure maxScore is set for result display
        if (data.submission) {
          setSubmission({
            ...data.submission,
            maxScore: data.submission.maxScore ?? data.submission.totalPoints
          });
        } else {
          setSubmission(null);
        }
      } else if (response.status === 404) {
        toast.error('Quiz not found')
        router.push('/student/quizzes')
      } else {
        toast.error('Failed to load quiz details')
      }
    } catch (error) {
      console.error('Error fetching quiz details:', error)
      toast.error('Error loading quiz details')
    } finally {
      setLoading(false)
    }
  }

  const isQuizAvailable = () => {
    if (!quiz) return false
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.isActive
  }

  const getQuizStatus = () => {
    if (!quiz) return 'loading'
    
    if (submission) {
      return 'completed'
    }
    
    const now = new Date()
    const endDate = new Date(quiz.endDate)
    
    if (now > endDate) {
      return 'expired'
    }
    
    if (isQuizAvailable()) {
      return 'available'
    }
    
    return 'upcoming'
  }

  const getTotalPoints = () => {
    if (!quiz || !quiz.questions) return 0
    return quiz.questions.reduce((total, q) => total + q.points, 0)
  }

  // Calculate attempts
  const attemptsAllowed = quiz?.attempts ?? 1;
  // Use the count of all submissions for this quiz as attempts used
  const attemptsUsed = allQuizSubmissions.length;
  // Check eligibility for retake quizzes
  let isEligible = true;
  if (quiz?.eligibleStudents && Array.isArray(quiz.eligibleStudents) && quiz.eligibleStudents.length > 0 && user) {
    // eligibleStudents are always strings, user._id is the MongoDB id
    isEligible = quiz.eligibleStudents.includes(user._id);
  }
  const hasAttemptsLeft = (attemptsAllowed === 999 || attemptsUsed < attemptsAllowed) && isEligible;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The quiz you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/student/quizzes"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  const status = getQuizStatus()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/student/quizzes"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {quiz.course.subject} • {quiz.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {status === 'completed' ? (
                <span className="flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </span>
              ) : status === 'available' ? (
                <span className="flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">
                  <Play className="h-4 w-4 mr-1" />
                  Available
                </span>
              ) : status === 'expired' ? (
                <span className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Expired
                </span>
              ) : (
                <span className="flex items-center px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                  <Clock className="h-4 w-4 mr-1" />
                  Upcoming
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Available From:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(quiz.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Due Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(quiz.endDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Time Limit:</span>
                  <p className="text-gray-600 dark:text-gray-400">{quiz.timeLimit} minutes</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Questions:</span>
                  <p className="text-gray-600 dark:text-gray-400">{quiz.questions?.length || 0} questions</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Total Points:</span>
                  <p className="text-gray-600 dark:text-gray-400">{getTotalPoints()} points</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Attempts Allowed:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {attemptsAllowed === 999 ? 'Unlimited' : attemptsAllowed}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Attempts Used:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {attemptsAllowed === 999 ? `${attemptsUsed}` : `${attemptsUsed} / ${attemptsAllowed}`}
                  </p>
                </div>
              </div>
              {/* Start Quiz button placed here, after details grid but before card closes */}
              <div className="mt-8">
                <Link
                  href={hasAttemptsLeft ? `/student/quizzes/${quiz._id}/take` : '#'}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${hasAttemptsLeft ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  tabIndex={hasAttemptsLeft ? 0 : -1}
                  aria-disabled={!hasAttemptsLeft}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Quiz
                </Link>
                {!isEligible && (
                  <div className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm font-semibold">
                    You are not eligible to take this retake quiz.
                  </div>
                )}
                {isEligible && !hasAttemptsLeft && (
                  <div className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm font-semibold">
                    You have used all your allowed attempts for this quiz.
                  </div>
                )}
              </div>
            </div>
            {/* Quiz Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start">
                  <Timer className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Time Management</p>
                    <p className="text-sm">You have {quiz.timeLimit} minutes to complete this quiz. The timer will start when you begin.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Submission</p>
                    <p className="text-sm">Your quiz will be automatically submitted when time expires or when you click submit.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Important</p>
                    <p className="text-sm">Make sure you have a stable internet connection. You cannot pause the quiz once started.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display */}
            {submission && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Result</h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Score: {submission.score}/{submission.maxScore ?? submission.totalPoints}
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {submission.maxScore || submission.totalPoints ? Math.round((submission.score / (submission.maxScore ?? submission.totalPoints)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                    <div>
                      <span className="font-medium">Completed:</span>
                      <p>{new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Time Spent:</span>
                      <p>{Math.floor(submission.timeSpent / 60)}:{(submission.timeSpent % 60).toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.course.subject} • Grade {quiz.course.gradeLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.teacher.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/student/courses/${quiz.course._id}`}
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Course
                </Link>
                <Link
                  href="/student/quizzes"
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  All Quizzes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

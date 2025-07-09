'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  Award
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Quiz {
  _id: string
  title: string
  description: string
  showResults: 'immediately' | 'after-deadline' | 'manual'
  endDate: string
  questions: {
    _id: string
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[]
    correctAnswer: string
    points: number
  }[]
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
}

interface QuizSubmission {
  _id: string
  score: number
  maxScore: number
  submittedAt: string
  timeSpent: number
  answers: {
    questionIndex: number
    answer: string
  }[]
  isGraded: boolean
  feedback?: string
}

interface APIResponse {
  quiz: Quiz
  submission: QuizSubmission
  canShowResults: boolean
  message: string
}

export default function QuizResultsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  const [canShowResults, setCanShowResults] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (quizId) {
      fetchQuizResults()
    }
  }, [quizId])

  const fetchQuizResults = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/quizzes/${quizId}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data: APIResponse = await response.json()
        setQuiz(data.quiz)
        setSubmission(data.submission)
        setCanShowResults(data.canShowResults)
        setMessage(data.message)
        
        if (!data.canShowResults) {
          toast(data.message)
        }
      } else if (response.status === 404) {
        toast.error('Quiz results not found')
        router.push('/student/quizzes')
      } else if (response.status === 401) {
        toast.error('Please log in to view results')
        router.push('/auth/login')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to load quiz results')
      }
    } catch (error) {
      console.error('Error fetching quiz results:', error)
      toast.error('Error loading quiz results')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!quiz || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Results Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message || 'Quiz results are not available or you don\'t have permission to view them.'}
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

  // If results cannot be shown, display limited information
  if (!canShowResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/student/quizzes"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </div>

            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h1>
              <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">
                {message}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quiz.course.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quiz.course.gradeLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Teacher:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quiz.teacher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {submission.timeSpent} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const percentage = Math.round((submission.score / submission.maxScore) * 100)
  const getGrade = (percent: number) => {
    if (percent >= 90) return { grade: 'A+', color: 'text-green-600 dark:text-green-400' }
    if (percent >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400' }
    if (percent >= 70) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' }
    if (percent >= 60) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' }
    if (percent >= 50) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' }
    return { grade: 'F', color: 'text-red-600 dark:text-red-400' }
  }

  const gradeInfo = getGrade(percentage)

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title} - Results</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {quiz.course.title} • {quiz.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {submission.score}/{submission.maxScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${gradeInfo.color}`}>
                    {gradeInfo.grade}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {submission.timeSpent}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Used</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question-by-Question Results</h3>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const studentAnswer = submission.answers.find(a => a.questionIndex === index)
                  const isCorrect = studentAnswer?.answer === question.correctAnswer
                  
                  return (
                    <div key={index} className={`border rounded-lg p-4 ${
                      isCorrect 
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Question {index + 1}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                          <span className="text-sm font-medium">
                            {isCorrect ? question.points : 0}/{question.points} pts
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {question.question}
                      </p>
                      
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="mb-3">
                          <div className="grid grid-cols-1 gap-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded border text-sm ${
                                  option === question.correctAnswer
                                    ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                                    : option === studentAnswer?.answer
                                    ? 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ Correct</span>
                                )}
                                {option === studentAnswer?.answer && option !== question.correctAnswer && (
                                  <span className="ml-2 text-red-600 dark:text-red-400 font-medium">✗ Your Answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Answer:</span>
                          <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {studentAnswer?.answer || 'No answer provided'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answer:</span>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              {question.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.course.subject} • {quiz.course.gradeLevel}
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
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/student/quizzes/${quiz._id}`}
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Quiz Details
                </Link>
                <Link
                  href="/student/quizzes"
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Quizzes
                </Link>
                <Link
                  href="/student/dashboard"
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

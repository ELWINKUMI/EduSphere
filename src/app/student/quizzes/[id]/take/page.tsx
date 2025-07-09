'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Quiz {
  _id: string
  title: string
  description: string
  questions: {
    _id: string
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[]
    points: number
  }[]
  timeLimit: number // in minutes
  attempts: number
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
  startDate: string
  endDate: string
}

interface QuizSubmission {
  _id: string
  answers: { [questionId: string]: string }
  submittedAt: string
  score?: number
  totalPoints?: number
  isGraded: boolean
}

export default function TakeQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)

  useEffect(() => {
    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStarted, timeLeft, quizSubmitted])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Quiz data received:', data.quiz)
        if (data.quiz && data.quiz.questions) {
          console.log('Questions:', data.quiz.questions.map((q: Quiz['questions'][number]) => ({
            type: q.type,
            hasOptions: !!q.options,
            optionsLength: q.options ? q.options.length : 0,
            options: q.options
          })))
        }
        setQuiz(data.quiz)
        
        // Check if student already submitted
        if (data.submission) {
          setSubmission(data.submission)
          setQuizSubmitted(true)
          setAnswers(data.submission.answers || {})
        }
      } else if (response.status === 404) {
        toast.error('Quiz not found')
        router.push('/student/quizzes')
      } else {
        toast.error('Failed to load quiz')
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
      toast.error('Error loading quiz')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    if (!quiz) return
    
    setQuizStarted(true)
    setTimeLeft(quiz.timeLimit * 60) // Convert minutes to seconds
    toast.success('Quiz started! Good luck!')
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleAutoSubmit = useCallback(async () => {
    if (quizSubmitted) return
    
    toast.error('Time is up! Submitting quiz automatically...')
    await submitQuiz(true)
  }, [quizSubmitted])

  const submitQuiz = async (isAutoSubmit = false) => {
    if (submitting || quizSubmitted) return

    setSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers,
          submittedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSubmission(data.submission)
        setQuizSubmitted(true)
        
        if (isAutoSubmit) {
          toast.success('Quiz submitted automatically due to time limit')
        } else {
          toast.success('Quiz submitted successfully!')
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit quiz')
        return
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Error submitting quiz')
      return
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600 dark:text-green-400' // > 5 minutes
    if (timeLeft > 60) return 'text-yellow-600 dark:text-yellow-400' // > 1 minute
    return 'text-red-600 dark:text-red-400' // < 1 minute
  }

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

  // Check if quiz is available
  const now = new Date()
  const startDate = new Date(quiz.startDate)
  const endDate = new Date(quiz.endDate)
  const isAvailable = now >= startDate && now <= endDate

  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {now < startDate 
              ? `This quiz will be available on ${startDate.toLocaleDateString()}`
              : `This quiz ended on ${endDate.toLocaleDateString()}`
            }
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

  // Show results if quiz is submitted
  if (quizSubmitted && submission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your quiz has been submitted successfully.
            </p>
            
            {submission.isGraded && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Score</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {submission.score}/{submission.totalPoints}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {Math.round((submission.score! / submission.totalPoints!) * 100)}%
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/student/quizzes"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Quizzes
              </Link>
              <Link
                href="/student/dashboard"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quiz Details</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Questions: {quiz.questions.length}</li>
                  <li>Time Limit: {quiz.timeLimit} minutes</li>
                  <li>Total Points: {quiz.questions.reduce((sum, q) => sum + q.points, 0)}</li>
                  <li>Attempts Allowed: {quiz.attempts === 999 ? 'Unlimited' : quiz.attempts}</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Course Information</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Subject: {quiz.course.subject}</li>
                  <li>Grade: {quiz.course.gradeLevel}</li>
                  <li>Teacher: {quiz.teacher.name}</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Instructions</h3>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                <li>• Make sure you have a stable internet connection</li>
                <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>
                <li>• The quiz will auto-submit when time expires</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• Review your answers before final submission</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href={`/student/quizzes/${quiz._id}`}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Quiz Details
              </Link>
              <button
                onClick={startQuiz}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz taking interface
  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with timer */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${getTimeColor()}`}>
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {currentQuestion + 1}
              </h2>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded">
                {currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQ.type === 'multiple-choice' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.length > 0 ? currentQ.options.map((option, index) => (
                  <label key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      value={option}
                      checked={answers[currentQ._id] === option}
                      onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                      className="h-4 w-4 text-blue-600 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                )) : (
                  <div className="text-red-500 p-3 border border-red-200 rounded-lg">
                    No options available for this question. Please contact your teacher.
                  </div>
                )}
              </div>
            )}
            
            {currentQ.type === 'multiple-choice' && (!currentQ.options || currentQ.options.length === 0) && (
              <div className="text-red-500 p-3 border border-red-200 rounded-lg">
                No options available for this question. Please contact your teacher.
              </div>
            )}

            {currentQ.type === 'true-false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      value={option}
                      checked={answers[currentQ._id] === option}
                      onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                      className="h-4 w-4 text-blue-600 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'short-answer' && (
              <textarea
                value={answers[currentQ._id] || ''}
                onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                placeholder="Enter your answer here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => submitQuiz()}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>

          {/* Question navigation */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Navigation:</p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[quiz.questions[index]._id]
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

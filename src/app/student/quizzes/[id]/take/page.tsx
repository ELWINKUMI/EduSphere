'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle
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
  userId: string
  answers: { [questionId: string]: string }
  submittedAt: string
  score?: number
  totalPoints?: number
  isGraded: boolean
  attemptNumber?: number
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
  const [timeLeft, setTimeLeft] = useState<number>(1800)
  const [currentView, setCurrentView] = useState<'start' | 'taking' | 'completed'>('start')
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  
  // Track all submissions for this quiz by this user
  const [allSubmissions, setAllSubmissions] = useState<QuizSubmission[]>([])
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const [hasAttemptsLeft, setHasAttemptsLeft] = useState<boolean>(true)

  // FIXED: Use user._id instead of user.id to match backend
  const userId = user?._id || user?.id

  useEffect(() => {
    if (quizId && userId) {
      fetchQuiz()
      fetchUserSubmissions()
    }
  }, [quizId, userId])

  // Fetch only the current user's submissions for this quiz
  const fetchUserSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !userId) return
      
      // FIXED: Use the correct user ID property
      const response = await fetch(`/api/quiz-submissions?quizId=${quizId}&userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const submissions = data.submissions || []
        setAllSubmissions(submissions)
        console.log('Fetched submissions:', submissions) // Debug log
      } else {
        console.error('Failed to fetch submissions:', response.status)
        setAllSubmissions([])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setAllSubmissions([])
    }
  }

  // Fetch quiz
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
        setQuiz(data.quiz)
        console.log('Fetched quiz:', data.quiz) // Debug log
      } else if (response.status === 404) {
        toast.error('Quiz not found')
        router.push('/student/quizzes')
      } else {
        toast.error('Failed to load quiz')
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
      toast.error('Error loading quiz')
    } finally {
      setLoading(false)
    }
  }

  // Clamp attemptsUsed and block only if limit is truly reached
  useEffect(() => {
    if (!quiz || !Array.isArray(allSubmissions)) return;

    const attemptsAllowed = quiz.attempts || 1;
    const attemptsUsedCount = Math.min(allSubmissions.length, attemptsAllowed);
    const isUnlimited = attemptsAllowed === 999;
    const hasAttemptsRemaining = isUnlimited || allSubmissions.length < attemptsAllowed;

    setAttemptsUsed(attemptsUsedCount);
    setHasAttemptsLeft(hasAttemptsRemaining);

    // Set view based on attempts remaining
    if (hasAttemptsRemaining) {
      setCurrentView('start');
      setQuizSubmitted(false);
      setSubmission(null);
      setAnswers({});
    } else {
      const lastSubmission = allSubmissions[allSubmissions.length - 1];
      setCurrentView('completed');
      setQuizSubmitted(true);
      setSubmission(lastSubmission);
      setAnswers(lastSubmission?.answers || {});
    }
  }, [quiz, allSubmissions]);

  // Timer effect
  useEffect(() => {
    if (currentView === 'taking' && timeLeft > 0 && !quizSubmitted) {
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
  }, [currentView, timeLeft, quizSubmitted])

  const startQuiz = () => {
    if (!quiz) return
    
    // FIXED: Double-check attempts before starting
    if (!hasAttemptsLeft) {
      toast.error('You have used all your allowed attempts for this quiz.')
      return
    }
    
    setCurrentView('taking')
    setTimeLeft(quiz.timeLimit * 60)
    setAnswers({}) // Reset answers for new attempt
    setCurrentQuestion(0) // Reset to first question
    toast.success('Quiz started! Good luck!')
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
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
        setCurrentView('completed')
        
        // FIXED: Refresh submissions after successful submit
        await fetchUserSubmissions()
        
        if (isAutoSubmit) {
          toast.success('Quiz submitted automatically due to time limit')
        } else {
          toast.success('Quiz submitted successfully!')
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Error submitting quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeLeft > 600) return 'text-emerald-400'
    if (timeLeft > 300) return 'text-yellow-400'
    return 'text-red-400'
  }

  // FIXED: Helper function to get attempts info
  const getAttemptsInfo = () => {
    if (!quiz) return { used: 0, allowed: 1, isUnlimited: false };
    const allowed = quiz.attempts || 1;
    // Clamp used to allowed
    const used = Math.min(attemptsUsed, allowed);
    const isUnlimited = allowed === 999;
    return { used, allowed, isUnlimited };
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white/80 mt-6 text-lg">Loading your quiz...</p>
        </div>
      </div>
    )
  }

  // Start Screen
  if (currentView === 'start' && quiz) {
    const { used, allowed, isUnlimited } = getAttemptsInfo()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <Clock className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Questions: {quiz.questions.length}</li>
                <li>Time Limit: {quiz.timeLimit} minutes</li>
                <li>Total Points: {quiz.questions.reduce((sum, q) => sum + q.points, 0)}</li>
                <li>
                  Attempts Used: {isUnlimited ? `${used}` : `${used} / ${allowed}`}
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Course Information</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Subject: {quiz.course.subject}</li>
                <li>Grade: {quiz.course.gradeLevel}</li>
                <li>Teacher: {quiz.teacher.name}</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="font-semibold text-gray-900">Important Instructions</h3>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li>• Ensure a stable internet connection</li>
              <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>
              <li>• The quiz will auto-submit when time expires</li>
              <li>• Navigate between questions using the buttons</li>
              <li>• Review your answers before final submission</li>
            </ul>
          </div>

          {/* FIXED: Show attempts warning only when no attempts left */}
          {!hasAttemptsLeft && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
              You have used all your allowed attempts for this quiz.<br />
              Attempts Used: {isUnlimited ? `${used}` : `${used} / ${allowed}`}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Link
              href={`/student/quizzes/${quiz._id}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz Details
            </Link>
            <button
              onClick={startQuiz}
              disabled={!hasAttemptsLeft}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                hasAttemptsLeft 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasAttemptsLeft ? 'Start Quiz' : 'No Attempts Left'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Taking Screen
  if (currentView === 'taking' && quiz) {
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

  // Completion Screen
  if (currentView === 'completed' && quiz) {
    const { used, allowed, isUnlimited } = getAttemptsInfo()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">
            Your quiz has been submitted successfully.
          </p>
          
          {/* Show attempts info */}
          {!isUnlimited && used >= allowed && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-base font-semibold">
              You have used all your allowed attempts for this quiz.<br />
              Attempts Used: {used} / {allowed}
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
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
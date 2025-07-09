'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  points: number
}

interface QuizTakerProps {
  quiz: {
    id: string
    title: string
    timeLimit: number // in minutes
    questions: Question[]
  }
  onSubmit: (answers: Record<string, string | string[]>) => Promise<void>
}

export default function QuizTaker({ quiz, onSubmit }: QuizTakerProps) {
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60) // Convert to seconds
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false)

  // Auto-submit when time runs out
  const handleAutoSubmit = useCallback(async () => {
    if (!isSubmitting && !isAutoSubmitted) {
      setIsAutoSubmitted(true)
      setIsSubmitting(true)
      try {
        await onSubmit(answers)
      } catch (error) {
        console.error('Auto-submit failed:', error)
      }
    }
  }, [answers, onSubmit, isSubmitting, isAutoSubmitted])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, handleAutoSubmit])

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleManualSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(answers)
    } catch (error) {
      console.error('Manual submit failed:', error)
      setIsSubmitting(false)
    }
  }

  const isTimeWarning = timeLeft <= 300 // 5 minutes warning
  const isTimeCritical = timeLeft <= 60 // 1 minute critical

  if (isAutoSubmitted || isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAutoSubmitted ? 'Time\'s Up!' : 'Quiz Submitted'}
          </h2>
          <p className="text-gray-600">
            {isAutoSubmitted 
              ? 'Your quiz has been automatically submitted.' 
              : 'Your answers have been saved successfully.'}
          </p>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isTimeCritical 
              ? 'bg-red-100 text-red-700 timer-warning' 
              : isTimeWarning 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
            {isTimeWarning && (
              <AlertTriangle className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1}
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQ.type === 'multiple-choice' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'true-false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'short-answer' && (
              <textarea
                value={(answers[currentQ.id] as string) || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Type your answer here..."
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Question Overview</h3>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[quiz.questions[index].id]
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Answered: {Object.keys(answers).length} / {quiz.questions.length}
          </p>
        </div>
      </div>
    </div>
  )
}

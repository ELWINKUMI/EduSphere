'use client'

import { useState } from 'react'
import QuizTaker from '@/components/quiz/QuizTaker'

// Demo quiz data
const demoQuiz = {
  id: 'demo-quiz-1',
  title: 'JavaScript Fundamentals Quiz',
  timeLimit: 10, // 10 minutes for demo
  questions: [
    {
      id: 'q1',
      question: 'What is the correct way to declare a variable in JavaScript?',
      type: 'multiple-choice' as const,
      options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
      points: 2
    },
    {
      id: 'q2', 
      question: 'JavaScript is a compiled language.',
      type: 'true-false' as const,
      points: 1
    },
    {
      id: 'q3',
      question: 'Explain the difference between let and var in JavaScript.',
      type: 'short-answer' as const,
      points: 3
    },
    {
      id: 'q4',
      question: 'Which of the following are primitive data types in JavaScript? (Select all that apply)',
      type: 'multiple-choice' as const,
      options: ['string', 'number', 'object', 'boolean', 'array'],
      points: 2
    },
    {
      id: 'q5',
      question: 'Arrays in JavaScript are zero-indexed.',
      type: 'true-false' as const,
      points: 1
    }
  ]
}

export default function DemoQuizPage() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleQuizSubmit = async (answers: Record<string, string | string[]>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock results
    const mockResults = {
      score: 7,
      totalPoints: 9,
      percentage: 78,
      timeSpent: 8.5
    }
    
    setResults(mockResults)
    setQuizCompleted(true)
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Great job! Here are your results:</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className="font-semibold">{results.score}/{results.totalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-semibold">{results.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Spent:</span>
              <span className="font-semibold">{results.timeSpent} minutes</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setQuizStarted(false)
              setQuizCompleted(false)
              setResults(null)
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    )
  }

  if (quizStarted) {
    return <QuizTaker quiz={demoQuiz} onSubmit={handleQuizSubmit} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="mb-6">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{demoQuiz.title}</h2>
          <p className="text-gray-600 mb-4">
            Test your JavaScript knowledge with this quick quiz.
          </p>
        </div>
        
        <div className="space-y-3 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Questions:</span>
            <span className="font-semibold">{demoQuiz.questions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Limit:</span>
            <span className="font-semibold">{demoQuiz.timeLimit} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Points:</span>
            <span className="font-semibold">
              {demoQuiz.questions.reduce((sum, q) => sum + q.points, 0)}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setQuizStarted(true)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
        >
          Start Quiz
        </button>
        
        <p className="text-xs text-gray-500 mt-4">
          Make sure you have a stable internet connection before starting.
        </p>
      </div>
    </div>
  )
}

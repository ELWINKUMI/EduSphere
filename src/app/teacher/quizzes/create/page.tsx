'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string
  points: number
}

interface Subject {
  _id: string
  title: string
  subject: string
  gradeLevel: string
}

export default function CreateQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    timeLimit: '',
    maxAttempts: '1',
    showResults: 'immediately',
    startDate: '',
    endDate: ''
  })
  
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (user && user.role === 'teacher') {
      fetchSubjects()
    } else if (user && user.role !== 'teacher') {
      // Redirect non-teachers away from this page
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubjects(data.subjects || [])
      } else {
        toast.error('Failed to load subjects')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      toast.error('Error loading subjects')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value }
        
        // Handle question type changes
        if (field === 'type') {
          if (value === 'multiple-choice') {
            // Ensure options array exists for multiple choice
            updatedQuestion.options = updatedQuestion.options || ['', '', '', '']
          } else if (value === 'true-false') {
            // Clear options for true/false questions
            updatedQuestion.options = undefined
          } else if (value === 'short-answer') {
            // Clear options for short answer questions
            updatedQuestion.options = undefined
          }
          // Reset correct answer when type changes
          updatedQuestion.correctAnswer = ''
        }
        
        return updatedQuestion
      }
      return q
    }))
  }

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.courseId || questions.length === 0) {
      toast.error('Please fill in all required fields and add at least one question')
      return
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question || !question.correctAnswer) {
        toast.error('All questions must have content and correct answers')
        return
      }
      if (question.type === 'multiple-choice' && (!question.options || question.options.some(opt => !opt || opt.trim() === ''))) {
        toast.error('Multiple choice questions must have all options filled')
        return
      }
    }

    console.log('Questions being sent:', questions.map(q => ({
      type: q.type,
      hasOptions: !!q.options,
      options: q.options
    })))

    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
          maxAttempts: parseInt(formData.maxAttempts),
          questions,
        }),
      })

      if (response.ok) {
        toast.success('Quiz created successfully!')
        router.push('/teacher/dashboard')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to create quiz')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    if (subjects.length === 1) {
      setFormData(prev => ({
        ...prev,
        courseId: subjects[0]._id
      }))
    }
  }, [subjects])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only teachers can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/teacher/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <div className="bg-purple-600 p-2 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                  <p className="text-gray-600">Create a timed quiz for your students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Quiz Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Chapter 5 Quiz"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  disabled={loadingSubjects}
                >
                  <option value="">
                    {loadingSubjects ? 'Loading subjects...' : 'Select a subject/course'}
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subject} - Grade {subject.gradeLevel} ({subject.title})
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Time Limit (minutes)"
                name="timeLimit"
                type="number"
                value={formData.timeLimit}
                onChange={handleChange}
                placeholder="30"
                min="1"
                max="300"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attempts
                </label>
                <select
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">1 attempt</option>
                  <option value="2">2 attempts</option>
                  <option value="3">3 attempts</option>
                  <option value="-1">Unlimited</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show Results
                </label>
                <select
                  name="showResults"
                  value={formData.showResults}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="immediately">Show immediately after submission</option>
                  <option value="after-deadline">Show after quiz deadline</option>
                  <option value="manual">Show when manually released</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Textarea
                label="Quiz Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide instructions and description for the quiz..."
                rows={3}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium text-gray-900">Question {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <Textarea
                          label="Question"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>
                        </div>
                        
                        <Input
                          label="Points"
                          type="number"
                          value={question.points.toString()}
                          onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>

                    {/* Question-specific inputs */}
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {question.options?.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === option}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                              className="h-4 w-4 text-purple-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              value="True"
                              checked={question.correctAnswer === 'True'}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              className="h-4 w-4 text-purple-600 mr-2"
                            />
                            True
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              value="False"
                              checked={question.correctAnswer === 'False'}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              className="h-4 w-4 text-purple-600 mr-2"
                            />
                            False
                          </label>
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div>
                        <Input
                          label="Sample Correct Answer"
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                          placeholder="Enter a sample correct answer for reference..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/teacher/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || questions.length === 0}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

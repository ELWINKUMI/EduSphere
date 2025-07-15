'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Plus, Trash2, Sparkles, Timer, Users, Settings, BookOpen } from 'lucide-react'
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
  const [isRetake, setIsRetake] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([])

  // On mount, check for retakeQuizInfo in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const retakeInfoRaw = localStorage.getItem('retakeQuizInfo');
      if (retakeInfoRaw) {
        try {
          const retakeInfo = JSON.parse(retakeInfoRaw);
          setFormData(prev => ({
            ...prev,
            title: retakeInfo.newTitle || '',
            startDate: retakeInfo.newStartDate || '',
            endDate: retakeInfo.newEndDate || '',
          }));
          setIsRetake(true);
        } catch {
          setIsRetake(false);
          setFormData(prev => ({ ...prev, title: '' }));
        }
      } else {
        setIsRetake(false);
        setFormData(prev => ({ ...prev, title: '' }));
      }
    }
  }, []);

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

  // Fisher-Yates shuffle
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle options for each multiple-choice question and update correctAnswer
  function shuffleQuestionsAndOptions(questions: Question[]): Question[] {
    return shuffleArray(questions).map((q) => {
      if (
        q.type === 'multiple-choice' &&
        q.options &&
        q.options.length > 1 &&
        q.options.every(opt => opt && opt.trim() !== '')
      ) {
        // Pair each option with a flag if it's the correct answer
        const optionPairs = q.options.map(opt => ({
          value: opt,
          isCorrect: opt === q.correctAnswer
        }));
        // Shuffle the pairs
        const shuffledPairs = shuffleArray(optionPairs);
        // Find the new correct answer
        const newCorrect = shuffledPairs.find(pair => pair.isCorrect)?.value || '';
        return {
          ...q,
          options: shuffledPairs.map(pair => pair.value),
          correctAnswer: newCorrect
        };
      }
      return q;
    });
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

    // Shuffle questions and options before sending
    const shuffledQuestions = shuffleQuestionsAndOptions(questions);

    console.log('Questions being sent:', shuffledQuestions.map(q => ({
      type: q.type,
      hasOptions: !!q.options,
      options: q.options,
      correctAnswer: q.correctAnswer
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
          questions: shuffledQuestions,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
          <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-purple-200">Only teachers can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/teacher/dashboard"
                className="flex items-center text-purple-200 hover:text-white mr-6 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-xl mr-4 shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Create New Quiz
                  </h1>
                  <p className="text-purple-200">Design an engaging quiz for your students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Settings */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-8 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Quiz Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Quiz Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Chapter 5 Quiz"
                  required
                  className={`w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200${isRetake ? ' bg-gray-700 cursor-not-allowed' : ''}`}
                  readOnly={isRetake}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Subject/Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 text-purple-400 mr-2" />
                  <label className="block text-sm font-medium text-purple-200">
                    Time Limit (minutes)
                  </label>
                </div>
                <input
                  name="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  placeholder="30"
                  min="1"
                  max="300"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-purple-400 mr-2" />
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Number of Attempts
                  </label>
                </div>
                <input
                  type="number"
                  name="maxAttempts"
                  min={1}
                  value={formData.maxAttempts}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-slate-700/50 border-purple-500/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">
                  Show Results
                </label>
                <select
                  name="showResults"
                  value={formData.showResults}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="immediately">Show immediately after submission</option>
                  <option value="after-deadline">Show after quiz deadline</option>
                  <option value="manual">Show when manually released</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-purple-200">
                Quiz Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide instructions and description for the quiz..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-8 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Questions</h3>
                <span className="ml-3 bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-700/50 rounded-2xl p-8 border border-purple-500/20">
                  <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200 text-lg">No questions added yet</p>
                  <p className="text-purple-300 text-sm mt-2">Click "Add Question" to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-slate-700/50 border border-purple-500/20 rounded-xl p-6 transition-all duration-300 hover:border-purple-400/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg px-3 py-1 text-sm font-medium mr-3">
                          Q{index + 1}
                        </div>
                        <h4 className="text-lg font-medium text-white">Question {index + 1}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-purple-200">
                          Question
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question..."
                          rows={2}
                          className="w-full px-4 py-3 bg-slate-600/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-purple-200">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-purple-200">
                            Points
                          </label>
                          <input
                            type="number"
                            value={question.points.toString()}
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Question-specific inputs */}
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-purple-200">Options</label>
                        {question.options?.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === option}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                              className="h-4 w-4 text-purple-500 focus:ring-purple-400 focus:ring-2"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Correct Answer
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              value="True"
                              checked={question.correctAnswer === 'True'}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              className="h-4 w-4 text-purple-500 focus:ring-purple-400 focus:ring-2 mr-2"
                            />
                            <span className="text-white">True</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              value="False"
                              checked={question.correctAnswer === 'False'}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              className="h-4 w-4 text-purple-500 focus:ring-purple-400 focus:ring-2 mr-2"
                            />
                            <span className="text-white">False</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-purple-200">
                          Sample Correct Answer
                        </label>
                        <input
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                          placeholder="Enter a sample correct answer for reference..."
                          className="w-full px-4 py-3 bg-slate-600/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
              className="px-8 py-3 bg-slate-700/50 border border-purple-500/30 text-purple-200 rounded-xl hover:bg-slate-600/50 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || questions.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Quiz
                </div>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
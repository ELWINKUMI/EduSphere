'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import {
  BookOpen,
  ArrowLeft,
  Users,
  FileText,
  Play,
  Download,
  Bell,
  GraduationCap,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Subject {
  _id: string
  title: string
  subject: string
  gradeLevel: string
  description: string
  teacher: {
    _id: string
    name: string
  }
  maxStudents: number
  enrollmentCode: string
  students: string[]
  createdAt: string
}

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  maxPoints: number
  submissionType: string
  attachments?: string[]
  submissionCount: number
}

interface Quiz {
  _id: string
  title: string
  description: string
  timeLimit: number
  totalQuestions: number
  startDate: string
  endDate: string
  submissionCount: number
}

interface Student {
  _id: string
  name: string
  email?: string
  enrolledAt: string
}

export default function TeacherCourseDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'quizzes' | 'students' | 'resources' | 'analytics'>('overview')

  useEffect(() => {
    if (user && user.role === 'teacher') {
      fetchSubjectDetails()
      fetchResources()
    } else if (user && user.role !== 'teacher') {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router, courseId])

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courses/${courseId}/resources`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  const fetchSubjectDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubject(data.course)
        
        // Fetch related data
        await Promise.all([
          fetchAssignments(),
          fetchQuizzes(),
          fetchStudents()
        ])
      } else if (response.status === 404) {
        toast.error('Subject not found')
        router.push('/teacher/dashboard')
      } else {
        toast.error('Failed to load subject details')
      }
    } catch (error) {
      console.error('Error fetching subject details:', error)
      toast.error('Error loading subject details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courses/${courseId}/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments || [])
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/teacher/courses/${courseId}/quizzes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data.quizzes || [])
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courses/${courseId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Assignment deleted successfully')
        fetchAssignments()
      } else {
        toast.error('Failed to delete assignment')
      }
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Error deleting assignment')
    }
  }

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Quiz deleted successfully')
        fetchQuizzes()
      } else {
        toast.error('Failed to delete quiz')
      }
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast.error('Error deleting quiz')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Subject Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The subject you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
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
                href="/teacher/dashboard"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subject.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {subject.subject} • Grade {subject.gradeLevel}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">
                {subject.students?.length || 0} / {subject.maxStudents} students
              </span>
                <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full font-mono">
                  {subject.enrollmentCode}
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'quizzes', label: 'Quizzes', icon: Play },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'resources', label: 'Resources', icon: Download },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Resources</h3>
              <Link
                href={`/teacher/resources/create?courseId=${courseId}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </Link>
            </div>
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resources yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload your first resource to share materials with students.
                </p>
                <Link
                  href={`/teacher/resources/create?courseId=${courseId}`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {resources.map((resource) => (
                  <div key={resource._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Type: {resource.type}</span>
                        <span>Uploaded: {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About This Subject</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {subject.description || 'No description provided for this subject.'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                    <p className="text-gray-600 dark:text-gray-400">{subject.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Grade Level:</span>
                    <p className="text-gray-600 dark:text-gray-400">Grade {subject.gradeLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Enrollment Code:</span>
                    <p className="text-gray-600 dark:text-gray-400 font-mono">{subject.enrollmentCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Students</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{quizzes.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/teacher/assignments/create"
                    className="flex items-center w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Create Assignment
                  </Link>
                  <Link
                    href="/teacher/quizzes/create"
                    className="flex items-center w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Create Quiz
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Assignments</h3>
              <Link
                href={`/teacher/assignments/create?courseId=${courseId}`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No assignments yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first assignment to get started.
                </p>
                <Link
                  href={`/teacher/assignments/create?courseId=${courseId}`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {assignment.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {assignment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span>{assignment.maxPoints} points</span>
                          <span>{assignment.submissionCount} submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/teacher/assignments/${assignment._id}/analytics`}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/teacher/assignments/${assignment._id}/edit`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Assignment"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteAssignment(assignment._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Quizzes</h3>
              <Link
                href="/teacher/quizzes/create"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first quiz to get started.
                </p>
                <Link
                  href="/teacher/quizzes/create"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {quiz.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {quiz.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {quiz.timeLimit} minutes
                          </span>
                          <span>{quiz.totalQuestions} questions</span>
                          <span>{quiz.submissionCount} submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/teacher/quizzes/${quiz._id}/analytics`}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/teacher/quizzes/${quiz._id}/edit`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteQuiz(quiz._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Quiz"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Students</h3>
            </div>
            <div className="p-6">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students enrolled</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Students will appear here when they enroll using the course code: <span className="font-mono font-medium">{subject.enrollmentCode}</span>
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {students.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/teacher/students/${student._id}/grades`}
                          className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                        >
                          View Grades
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {students.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {assignments.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assignments</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {quizzes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {subject && Array.isArray(subject.students) && subject.maxStudents ?
                      Math.round((subject.students.length / subject.maxStudents) * 100)
                      : 0
                    }%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Enrollment</div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Detailed Analytics</h4>
                <p className="mb-4">View detailed analytics for individual assignments and quizzes.</p>
                <div className="space-x-4">
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Assignment Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Quiz Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

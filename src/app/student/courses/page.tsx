'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { BookOpen, Users, Calendar, Clock, FileText, Download, Plus } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  subject: string
  gradeLevel: string
  description: string
  teacher: {
    name: string
  }
  maxStudents: number
  enrollmentCode: string
  createdAt: string
}

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollmentCode, setEnrollmentCode] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!enrollmentCode.trim()) {
      toast.error('Please enter an enrollment code')
      return
    }

    setEnrolling(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enrollmentCode: enrollmentCode.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully enrolled in course!')
        setEnrollmentCode('')
        setShowEnrollModal(false)
        fetchCourses() // Refresh courses
      } else {
        toast.error(data.error || 'Failed to enroll in course')
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      toast.error('Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'from-blue-500 to-blue-600',
      'English Language': 'from-green-500 to-green-600',
      'Science': 'from-purple-500 to-purple-600',
      'Social Studies': 'from-orange-500 to-orange-600',
      'History': 'from-red-500 to-red-600',
      'Geography': 'from-teal-500 to-teal-600',
      'Physics': 'from-indigo-500 to-indigo-600',
      'Chemistry': 'from-pink-500 to-pink-600',
      'Biology': 'from-emerald-500 to-emerald-600',
    }
    return colors[subject as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Courses
              </h1>
              <p className="text-gray-600">Access your enrolled courses and materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEnrollModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Enroll in Course</span>
              </button>
              <Link
                href="/student/dashboard"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Use an enrollment code to join a course.
            </p>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Enroll in Your First Course</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Course Header */}
                <div className={`bg-gradient-to-r ${getSubjectColor(course.subject)} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-white/90 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/80 text-sm">{course.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/70 mb-1">Grade</div>
                      <div className="text-sm font-medium">{course.gradeLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Teacher Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.teacher?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">Course Instructor</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Started {formatDate(course.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Max {course.maxStudents}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                      >
                        View Course
                      </Link>
                      <Link
                        href={`/student/courses/${course.id}/assignments`}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Enroll in Course</h3>
            </div>
            <form onSubmit={handleEnrollment} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Code
                </label>
                <input
                  type="text"
                  value={enrollmentCode}
                  onChange={(e) => setEnrollmentCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter course code (e.g., MAT101ABC)"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Get this code from your teacher or course announcement
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEnrollModal(false)
                    setEnrollmentCode('')
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

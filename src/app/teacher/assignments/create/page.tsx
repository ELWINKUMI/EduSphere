'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Calendar, Upload } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'

interface Course {
  id: string  // Changed from _id to id to match API response
  title: string
  subject: string
  gradeLevel: string
}

export default function CreateAssignmentPage() {
  useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [attachments, setAttachments] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxPoints: '',
    submissionType: 'file',
    instructions: '',
    attempts: '1', // default 1 attempt
  })

  // Load teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('Authentication required')
          return
        }

        console.log('Fetching courses...')
        const response = await fetch('/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Courses API response:', data)
          console.log('Raw courses data:', JSON.stringify(data.courses, null, 2))
          
          // Check if courses array exists and has content
          if (!data.courses || !Array.isArray(data.courses)) {
            console.error('Courses API returned invalid data structure:', data)
            toast.error('Invalid courses data received')
            return
          }
          
          if (data.courses.length === 0) {
            console.warn('No courses found for teacher')
            toast('No courses found. Please create a course first.')
          }
          
          setCourses(data.courses || [])
          
          // Validate that courses have proper id fields (changed from _id to id)
          data.courses?.forEach((course: Course, index: number) => {
            console.log(`Course ${index}:`, course)
            if (!course.id || typeof course.id !== 'string') {
              console.error('Invalid course object:', course)
            }
          })
        } else {
          const errorData = await response.json()
          console.error('Failed to fetch courses:', errorData)
          toast.error('Failed to load courses')
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        toast.error('Error loading courses')
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(`Field changed: ${name} = ${value}`)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.description || !formData.courseId || !formData.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate courseId format (24 characters for MongoDB ObjectId)
    if (formData.courseId.length !== 24) {
      toast.error('Invalid course selection. Please select a valid course.')
      console.error('Invalid courseId length:', formData.courseId)
      return
    }

    // Debug information
    console.log('=== SUBMISSION DEBUG INFO ===')
    console.log('Form data:', formData)
    console.log('Selected course:', courses.find(c => c.id === formData.courseId)) // Changed from _id to id
    console.log('All courses:', courses)

    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        setLoading(false)
        return
      }

      // Create FormData for file uploads
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('course', formData.courseId) // Make sure this is the ObjectId
      form.append('dueDate', formData.dueDate)

      form.append('maxPoints', formData.maxPoints || '100')
      form.append('submissionType', formData.submissionType)
      form.append('attempts', formData.attempts || '1')

      // Add instructions if provided
      if (formData.instructions) {
        form.append('instructions', formData.instructions)
      }

      // Append files
      attachments.forEach(file => {
        form.append('attachments', file)
      })

      // Debug FormData contents
      console.log('FormData being sent:')
      Array.from(form.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`)
      })

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      })

      const responseData = await response.json()
      console.log('API Response:', responseData)

      if (response.ok) {
        toast.success('Assignment created successfully!')
        router.push('/teacher/dashboard')
      } else {
        toast.error(responseData.error || 'Failed to create assignment')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred. Please try again.')
    }
    
    setLoading(false)
  }

  // Get tomorrow's date as minimum due date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="bg-green-600 p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
                  <p className="text-gray-600">Create an assignment for your students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Assignment Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Chapter 5 Review Questions"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  {coursesLoading ? (
                    <div className="w-full px-4 py-3 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Loading courses...
                    </div>
                  ) : (
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}> {/* Changed from _id to id */}
                          {course.title} - {course.subject} (Grade {course.gradeLevel})
                        </option>
                      ))}
                    </select>
                  )}
                  {courses.length === 0 && !coursesLoading && (
                    <p className="text-sm text-red-600 mt-1">
                      No courses available. Please create a course first.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={minDate}
                      className="w-full px-4 py-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
              <Input
                label="Max Points"
                name="maxPoints"
                type="number"
                value={formData.maxPoints}
                onChange={handleChange}
                placeholder="100"
                min="1"
                max="1000"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Attempts
                </label>
                <input
                  type="number"
                  name="attempts"
                  min="1"
                  max="10"
                  value={formData.attempts}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">How many times students can submit this assignment (default: 1)</p>
              </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Assignment Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a clear description of what students need to do..."
                rows={4}
                required
              />
            </div>

            {/* Submission Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="file">File Upload</option>
                <option value="text">Text Submission</option>
                <option value="both">File Upload + Text</option>
              </select>
            </div>

            {/* Instructions */}
            <div>
              <Textarea
                label="Additional Instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Any additional instructions, formatting requirements, etc..."
                rows={3}
              />
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Files (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-green-600 hover:text-green-500 font-medium">
                      Click to upload files
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB each
                  </p>
                </div>
              </div>
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/teacher/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || courses.length === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { GRADE_LEVELS, ALL_GRADES, getSubjectsForGrade } from '@/lib/schoolConfig'

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    maxStudents: '30',
    enrollmentCode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Get available subjects for the selected grade level
  const availableSubjects = formData.gradeLevel ? getSubjectsForGrade(formData.gradeLevel) : []

  const generateEnrollmentCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData(prev => ({
      ...prev,
      enrollmentCode: code
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.subject || !formData.gradeLevel) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          gradeLevel: formData.gradeLevel,
          maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : 30,
          enrollmentCode: formData.enrollmentCode
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Course created successfully!')
        router.push('/teacher/dashboard')
      } else {
        toast.error(data.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                  <p className="text-gray-600">Set up a new course for your students</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Course Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics 101"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level *
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select grade level</option>
                    {ALL_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={!formData.gradeLevel}
                  >
                    <option value="">
                      {formData.gradeLevel ? 'Select subject' : 'First select grade level'}
                    </option>
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Max Students"
                  name="maxStudents"
                  type="number"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the course content, objectives, and expectations..."
                rows={4}
                required
              />
            </div>

            {/* Enrollment Code */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Enrollment</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="Enrollment Code"
                    name="enrollmentCode"
                    value={formData.enrollmentCode}
                    onChange={handleChange}
                    placeholder="Auto-generated or custom code"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateEnrollmentCode}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Generate Code
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Students will use this code to enroll in your course. Leave empty to auto-generate.
              </p>
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
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

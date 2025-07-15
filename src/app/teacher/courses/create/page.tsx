'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Sparkles, Users, Code, Wand2 } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/teacher/dashboard"
                className="group flex items-center text-slate-600 hover:text-slate-900 mr-6 transition-all duration-200"
              >
                <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors mr-3">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Create New Course
                  </h1>
                  <p className="text-slate-600 font-medium">Design an engaging learning experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Main Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Course Details</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                  <Input
                    label="Course Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Advanced Mathematics"
                    required
                    className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Grade Level *
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-slate-900 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 shadow-sm"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-slate-900 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Max Students
                    </div>
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3.5 text-slate-900 bg-white/80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Course Description</h3>
              </div>
              
              <Textarea
                label=""
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your course objectives, learning outcomes, and what makes it special..."
                rows={4}
                required
                className="transition-all duration-200 focus:scale-[1.01] focus:shadow-lg"
              />
            </div>

            {/* Enrollment Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Student Access</h3>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="Enrollment Code"
                    name="enrollmentCode"
                    value={formData.enrollmentCode}
                    onChange={handleChange}
                    placeholder="Auto-generated or custom code"
                    className="transition-all duration-200"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateEnrollmentCode}
                    className="group px-6 py-3.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-2xl hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105 flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Generate
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                💡 Students will use this code to join your course. Leave empty for auto-generation.
              </p>
            </div>

            {/* Modern Submit Section */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200">
              <Link
                href="/teacher/dashboard"
                className="px-8 py-3.5 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-200 font-medium hover:scale-105 hover:shadow-md"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
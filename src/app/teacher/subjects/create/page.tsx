'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, GraduationCap, Users, Calendar, Clock, Target, FileText } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { ALL_GRADES, getSubjectsForGrade, getSchoolLevel } from '@/lib/schoolConfig'

export default function CreateSubjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    maxStudents: '30',
    enrollmentCode: '',
    objectives: '',
    prerequisites: '',
    duration: '1', // Semester/Year
    schedule: ''
  })

  // Auto-generate enrollment code when title changes
  useEffect(() => {
    if (formData.title && formData.gradeLevel) {
      const code = `${formData.subject.slice(0, 3).toUpperCase()}${formData.gradeLevel.replace(/\s/g, '')}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
      setFormData(prev => ({
        ...prev,
        enrollmentCode: code
      }))
    }
  }, [formData.title, formData.gradeLevel, formData.subject])

  // Get available subjects for the selected grade level
  const availableSubjects = formData.gradeLevel ? getSubjectsForGrade(formData.gradeLevel) : []
  
  // Get school level for styling
  const schoolLevel = formData.gradeLevel ? getSchoolLevel(formData.gradeLevel) : null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateEnrollmentCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData(prev => ({
      ...prev,
      enrollmentCode: code
    }))
  }

  const handleGradeSelection = (grade: string) => {
    setSelectedGrades(prev => {
      if (prev.includes(grade)) {
        return prev.filter(g => g !== grade)
      } else {
        return [...prev, grade]
      }
    })
    
    // Set the primary grade for subject selection
    if (!selectedGrades.includes(grade)) {
      setFormData(prev => ({
        ...prev,
        gradeLevel: grade,
        subject: '' // Reset subject when grade changes
      }))
    }
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
          enrollmentCode: formData.enrollmentCode,
          objectives: formData.objectives,
          prerequisites: formData.prerequisites,
          duration: formData.duration,
          schedule: formData.schedule
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Subject created successfully!')
        router.push('/teacher/dashboard')
      } else {
        toast.error(data.error || 'Failed to create subject')
      }
    } catch (error) {
      console.error('Error creating subject:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getSchoolLevelColor = (level: string | null) => {
    switch (level) {
      case 'PRIMARY': return 'from-green-400 to-blue-500'
      case 'JHS': return 'from-blue-400 to-purple-500'
      case 'SHS': return 'from-purple-400 to-pink-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getSchoolLevelIcon = (level: string | null) => {
    switch (level) {
      case 'PRIMARY': return '🎨'
      case 'JHS': return '📚'
      case 'SHS': return '🎓'
      default: return '📖'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/teacher/dashboard"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Subject
                </h1>
                <p className="text-gray-600">Set up a new subject for your students</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Estimated time: 5-10 minutes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <span className="text-sm font-medium text-blue-600">Basic Information</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <span className="text-sm text-gray-400">Configuration</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <span className="text-sm text-gray-400">Review & Create</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Basic Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Subject Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Advanced Mathematics"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level *
                      </label>
                      <select
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Area *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      disabled={!formData.gradeLevel}
                    >
                      <option value="">
                        {formData.gradeLevel ? 'Select subject area' : 'First select grade level'}
                      </option>
                      {availableSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Textarea
                    label="Subject Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a comprehensive description of what students will learn in this subject..."
                    rows={4}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Advanced Configuration Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Learning Configuration
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Maximum Students"
                      name="maxStudents"
                      type="number"
                      value={formData.maxStudents}
                      onChange={handleChange}
                      placeholder="30"
                      min="1"
                      max="100"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="1">1 Semester</option>
                        <option value="2">2 Semesters (Full Year)</option>
                        <option value="0.5">Half Semester</option>
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Learning Objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    placeholder="What will students achieve by the end of this subject? List key learning outcomes..."
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />

                  <Textarea
                    label="Prerequisites"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    placeholder="What should students know before taking this subject? (Optional)"
                    rows={2}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />

                  <Input
                    label="Schedule Information"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Enrollment Configuration Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Enrollment Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        label="Enrollment Code"
                        name="enrollmentCode"
                        value={formData.enrollmentCode}
                        onChange={handleChange}
                        placeholder="AUTO-GENERATED"
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateEnrollmentCode}
                      className="mt-7 px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
                    >
                      Generate New
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Students will use this code to enroll in your subject
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  href="/teacher/dashboard"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    'Create Subject'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {formData.gradeLevel && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className={`bg-gradient-to-r ${getSchoolLevelColor(schoolLevel)} px-6 py-4`}>
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="text-2xl mr-2">{getSchoolLevelIcon(schoolLevel)}</span>
                    Preview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{formData.title || 'Subject Title'}</h4>
                      <p className="text-sm text-gray-600">{formData.subject} • {formData.gradeLevel}</p>
                    </div>
                    
                    {formData.description && (
                      <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Max Students: {formData.maxStudents}</span>
                      <span>Code: {formData.enrollmentCode}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg border border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Choose clear, descriptive titles that students can easily understand
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Include specific learning outcomes in your objectives
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Keep enrollment codes simple but unique
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You can always edit these details later
                </li>
              </ul>
            </div>

            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Subjects:</span>
                  <span className="font-medium">{availableSubjects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">School Level:</span>
                  <span className="font-medium">{schoolLevel || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration} Semester(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

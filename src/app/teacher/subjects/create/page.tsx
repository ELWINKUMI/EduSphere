"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, GraduationCap, Users, Calendar, Clock, Target, FileText, Sparkles, Wand2, Zap, Star } from 'lucide-react'
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
    term: '',
    maxStudents: '30',
    enrollmentCode: '',
    objectives: '',
    schedule: ''
  })

  // Helper to abbreviate subject, class, and term
  const SUBJECT_CODES: Record<string, string> = {
    'English Language': 'ENG',
    'Ghanaian Language': 'GH',
    'Mathematics': 'MATH',
    'Science': 'SCI',
    'Our World Our People (OWOP)': 'OWOP',
    'Our World Our People': 'OWOP',
    'Creative Arts': 'CAD',
    'Creative Arts and Design': 'CAD',
    'Career Technology': 'CT',
    'Computing': 'COMP',
    'Religious and Moral Education (RME)': 'RME',
    'Religious and Moral Education': 'RME',
    'Physical Education': 'PHE',
    'Physical and Health Education': 'PHE',
    'French': 'FR',
    'Social Studies': 'SOC',
    'Integrated Science': 'SCI',
    'Ghanaian Language and Culture': 'GH',
  };

  function getSubjectAbbr(subject: string) {
    if (!subject) return '';
    return SUBJECT_CODES[subject] || subject.slice(0, 4).toUpperCase();
  }

  function getClassAbbr(grade: string) {
    if (!grade) return '';
    if (grade.startsWith('Class')) return 'C' + grade.replace(/[^0-9]/g, '');
    if (grade.startsWith('JHS')) return 'J' + grade.replace(/[^0-9]/g, '');
    return grade.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  function getTermAbbr(term: string) {
    if (!term) return '';
    if (term.toLowerCase().includes('first')) return 'T1';
    if (term.toLowerCase().includes('second')) return 'T2';
    if (term.toLowerCase().includes('third')) return 'T3';
    return term.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  // Auto-generate enrollment code when subject, gradeLevel, or term changes
  useEffect(() => {
    if (formData.subject && formData.gradeLevel && formData.term) {
      const code = `${getSubjectAbbr(formData.subject)}${getClassAbbr(formData.gradeLevel)}${getTermAbbr(formData.term)}`;
      setFormData(prev => ({
        ...prev,
        enrollmentCode: code
      }));
    }
  }, [formData.subject, formData.gradeLevel, formData.term]);

  // Only allow Primary (Class 1-6) and Junior High (JHS1-3)
  const PRIMARY_CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];
  const JHS_CLASSES = ['JHS 1', 'JHS 2', 'JHS 3'];
  const GRADE_LEVELS = [...PRIMARY_CLASSES, ...JHS_CLASSES];

  // Subject lists for each grade band (must match backend config in schoolConfig.ts)
  const PRIMARY_SUBJECTS = [
    'Mathematics',
    'English Language',
    'Science',
    'Social Studies',
    'Our World Our People',
    'Religious & Moral Education',
    'Creative Arts',
    'Physical Education',
    'Information & Communication Technology (ICT)',
    'French',
    'Ghanaian Language',
  ];

  const JHS_SUBJECTS = [
    'English Language',
    'Mathematics',
    'Integrated Science',
    'Social Studies',
    'Ghanaian Language and Culture',
    'Religious and Moral Education',
    'Career Technology',
    'Computing',
    'Creative Arts and Design',
    'French',
  ];

  let subjectOptions: string[] = [];
  if (formData.gradeLevel) {
    if (PRIMARY_CLASSES.includes(formData.gradeLevel)) subjectOptions = PRIMARY_SUBJECTS;
    else if (JHS_CLASSES.includes(formData.gradeLevel)) subjectOptions = JHS_SUBJECTS;
  }

  const schoolLevel = formData.gradeLevel && PRIMARY_CLASSES.includes(formData.gradeLevel) ? 'PRIMARY' : (JHS_CLASSES.includes(formData.gradeLevel) ? 'JHS' : null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manual code generation (regenerates with current values)
  const generateEnrollmentCode = () => {
    if (formData.subject && formData.gradeLevel && formData.term) {
      const code = `${getSubjectAbbr(formData.subject)}${getClassAbbr(formData.gradeLevel)}${getTermAbbr(formData.term)}`;
      setFormData(prev => ({
        ...prev,
        enrollmentCode: code
      }));
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
      case 'PRIMARY': return 'from-emerald-400 to-teal-500'
      case 'JHS': return 'from-blue-400 to-indigo-500'
      case 'SHS': return 'from-purple-400 to-pink-500'
      default: return 'from-slate-400 to-slate-600'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 dark:text-gray-100 transition-colors">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/teacher/dashboard"
                className="group flex items-center text-slate-600 hover:text-slate-900 mr-6 transition-all duration-200"
              >
                <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 dark:bg-gray-800 dark:group-hover:bg-gray-700 transition-colors mr-3">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Create New Subject
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">Design an engaging learning experience</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-gray-800/60 rounded-full px-4 py-2">
              <Clock className="h-4 w-4" />
              <span>5-10 minutes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Progress Indicator */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                1
              </div>
              <div>
                <p className="font-semibold text-blue-600">Basic Information</p>
                <p className="text-xs text-slate-500">Subject details</p>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-slate-200 rounded-full mx-4"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-slate-400">Configuration</p>
                <p className="text-xs text-slate-400">Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Form Section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Basic Information Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden flex flex-col transition-colors">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 px-8 py-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    Subject Details
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Subject Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Advanced Mathematics"
                      required
                      className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                    />
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">
                        Grade Level *
                      </label>
                      <select
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 text-slate-900 dark:text-gray-100 bg-white/80 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-slate-300 dark:hover:border-gray-600 shadow-sm"
                        required
                      >
                        <option value="">Select grade level</option>
                        <optgroup label="🎨 Primary">
                          {PRIMARY_CLASSES.map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </optgroup>
                        <optgroup label="📚 Junior High">
                          {JHS_CLASSES.map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">
                      Subject Area *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 text-slate-900 dark:text-gray-100 bg-white/80 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-slate-300 dark:hover:border-gray-600 shadow-sm disabled:opacity-50"
                      required
                      disabled={!formData.gradeLevel}
                    >
                      <option value="">
                        {formData.gradeLevel ? 'Select subject area' : 'First select grade level'}
                      </option>
                      {subjectOptions.map((subject) => (
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
                    className="transition-all duration-200 focus:scale-[1.01] focus:shadow-lg"
                  />
                </div>
              </div>

              {/* Learning Configuration Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden flex flex-col transition-colors">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-900 dark:to-pink-900 px-8 py-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                      <Target className="h-5 w-5" />
                    </div>
                    Learning Configuration
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Maximum Students
                        </div>
                      </label>
                      <input
                        type="number"
                        name="maxStudents"
                        value={formData.maxStudents}
                        onChange={handleChange}
                        placeholder="30"
                        min="1"
                        max="100"
                        className="w-full px-4 py-3.5 text-slate-900 dark:text-gray-100 bg-white/80 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 hover:border-slate-300 dark:hover:border-gray-600 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Term
                        </div>
                      </label>
                      <select
                        name="term"
                        value={formData.term}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 text-slate-900 dark:text-gray-100 bg-white/80 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 hover:border-slate-300 dark:hover:border-gray-600 shadow-sm"
                        required
                      >
                        <option value="">Select term</option>
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                        <option value="Third Term">Third Term</option>
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Learning Outcomes"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    placeholder="What will students achieve by the end of this subject? List key learning outcomes..."
                    rows={3}
                    className="transition-all duration-200 focus:scale-[1.01] focus:shadow-lg"
                  />

                  <Input
                    label="Schedule Information"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM"
                    className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                  />
                </div>
              </div>

              {/* Enrollment Configuration Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden flex flex-col transition-colors">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 px-8 py-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                      <Zap className="h-5 w-5" />
                    </div>
                    Student Access
                  </h3>
                </div>
                <div className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        label="Enrollment Code"
                        name="enrollmentCode"
                        value={formData.enrollmentCode}
                        onChange={handleChange}
                        placeholder="Auto-generated"
                        className="transition-all duration-200 dark:bg-gray-900 dark:text-gray-100"
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
                  <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-gray-900 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 mt-4">
                    💡 Students will use this code to join your subject. Code auto-generates based on subject, grade, and term.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-8">
                <Link
                  href="/teacher/dashboard"
                  className="px-8 py-3.5 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-200 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium hover:scale-105 hover:shadow-md"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-900 dark:hover:to-indigo-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Create Subject
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Modern Sidebar */}
          <div className="flex flex-col gap-8 w-full">
            {/* Preview Card */}
            {formData.gradeLevel && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden flex flex-col transition-colors">
                <div className={`bg-gradient-to-r ${getSchoolLevelColor(schoolLevel)} px-6 py-4 dark:from-gray-900 dark:to-gray-800`}>
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <span className="text-2xl mr-3">{getSchoolLevelIcon(schoolLevel)}</span>
                    Live Preview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-gray-100 text-lg">{formData.title || 'Subject Title'}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{formData.subject} • {formData.gradeLevel}</p>
                    </div>
                    
                    {formData.description && (
                      <p className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50/80 dark:bg-gray-900 p-3 rounded-xl border border-slate-200 dark:border-gray-700 line-clamp-3">
                        {formData.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-xl">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-300">Max Students</p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{formData.maxStudents}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900 p-3 rounded-xl">
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">Code</p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{formData.enrollmentCode || 'AUTO'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-2xl shadow-lg border border-amber-200 dark:border-yellow-800 overflow-hidden flex flex-col transition-colors">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 dark:from-yellow-700 dark:to-orange-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Pro Tips
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start group">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-amber-800 dark:text-yellow-200 group-hover:text-amber-900 dark:group-hover:text-yellow-100 transition-colors">
                      Choose clear, descriptive titles that students can easily understand
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-amber-800 dark:text-yellow-200 group-hover:text-amber-900 dark:group-hover:text-yellow-100 transition-colors">
                      Include specific learning outcomes in your objectives
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-amber-800 dark:text-yellow-200 group-hover:text-amber-900 dark:group-hover:text-yellow-100 transition-colors">
                      Enrollment codes auto-generate based on your selections
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-amber-800 dark:text-yellow-200 group-hover:text-amber-900 dark:group-hover:text-yellow-100 transition-colors">
                      You can always edit these details later
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

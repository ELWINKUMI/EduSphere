'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { FileText, Download, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Submission {
  _id: string
  assignment: {
    _id: string
    title: string
    maxPoints: number
    dueDate: string
  }
  student: {
    _id: string
    name: string
  }
  files: string[]
  submittedAt: string
  grade?: number
  feedback?: string
  isGraded: boolean
}

interface Assignment {
  _id: string
  title: string
  dueDate: string
  maxPoints: number
  course: {
    title: string
    subject: string
    gradeLevel: string
  }
  submissionCount: number
}

export default function TeacherSubmissionsPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState<string | null>(null)
  const [gradeForm, setGradeForm] = useState<{[key: string]: {grade: string, feedback: string}}>({})

  useEffect(() => {
    fetchAssignments()
    fetchSubmissions()
  }, [])

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment)
    }
  }, [selectedAssignment])

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments.map((assignment: any) => ({
          ...assignment,
          submissionCount: 0 // Will be updated when we fetch submissions
        })))
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const fetchSubmissions = async (assignmentId?: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const url = assignmentId 
        ? `/api/submissions?assignmentId=${assignmentId}`
        : '/api/submissions'

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGradeChange = (submissionId: string, field: 'grade' | 'feedback', value: string) => {
    setGradeForm(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }))
  }

  const submitGrade = async (submissionId: string) => {
    const formData = gradeForm[submissionId]
    if (!formData || !formData.grade) {
      toast.error('Please enter a grade')
      return
    }

    const grade = parseInt(formData.grade)
    const submission = submissions.find(s => s._id === submissionId)
    if (!submission) return

    if (grade < 0 || grade > submission.assignment.maxPoints) {
      toast.error(`Grade must be between 0 and ${submission.assignment.maxPoints}`)
      return
    }

    setGrading(submissionId)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          grade: grade,
          feedback: formData.feedback || ''
        })
      })

      if (response.ok) {
        toast.success('Grade submitted successfully!')
        fetchSubmissions(selectedAssignment)
        setGradeForm(prev => {
          const updated = { ...prev }
          delete updated[submissionId]
          return updated
        })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to submit grade')
      }
    } catch (error) {
      console.error('Error submitting grade:', error)
      toast.error('Failed to submit grade')
    } finally {
      setGrading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSubmissionStatus = (submission: Submission) => {
    const dueDate = new Date(submission.assignment.dueDate)
    const submittedDate = new Date(submission.submittedAt)
    
    if (submission.isGraded) {
      return { status: 'graded', color: 'green', icon: CheckCircle }
    } else if (submittedDate > dueDate) {
      return { status: 'late', color: 'yellow', icon: Clock }
    } else {
      return { status: 'on-time', color: 'blue', icon: FileText }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
              <p className="text-gray-600">Review and grade student assignments</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/teacher/assignments/create"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Assignment
              </Link>
              <Link
                href="/teacher/dashboard"
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Assignment:</label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Assignments</option>
              {assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title} - {assignment.course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedAssignment ? 'No submissions for the selected assignment.' : 'No submissions available.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => {
              const statusInfo = getSubmissionStatus(submission)
              const StatusIcon = statusInfo.icon
              const formData = gradeForm[submission._id] || { grade: '', feedback: '' }

              return (
                <div
                  key={submission._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.assignment.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.status === 'graded' ? 'Graded' : 
                             statusInfo.status === 'late' ? 'Late Submission' : 'On Time'}
                          </span>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <strong>Student:</strong> {submission.student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Due Date:</strong> {formatDate(submission.assignment.dueDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Max Points:</strong> {submission.assignment.maxPoints}
                          </p>
                        </div>

                        {/* Submission Files */}
                        {submission.files && submission.files.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Files:</h4>
                            <div className="space-y-1">
                              {submission.files.map((filename, index) => {
                                const displayName = filename.includes('/') ? filename.split('/').pop() : filename
                                return (
                                  <button
                                    key={index}
                                    onClick={async () => {
                                      const token = localStorage.getItem('token')
                                      const cleanFilename = filename.includes('/') ? filename.split('/').pop() : filename
                                      
                                      if (!token || !cleanFilename) {
                                        toast.error('Unable to download file')
                                        return
                                      }

                                      try {
                                        console.log('Teacher downloading submission file:', cleanFilename)
                                        
                                        const response = await fetch(`/api/submissions/download/${encodeURIComponent(cleanFilename)}`, {
                                          headers: {
                                            'Authorization': `Bearer ${token}`
                                          }
                                        })

                                        if (response.ok) {
                                          const blob = await response.blob()
                                          const url = window.URL.createObjectURL(blob)
                                          const link = document.createElement('a')
                                          link.href = url
                                          link.download = displayName || cleanFilename
                                          document.body.appendChild(link)
                                          link.click()
                                          document.body.removeChild(link)
                                          window.URL.revokeObjectURL(url)
                                        } else {
                                          const error = await response.text()
                                          console.error('Download failed:', error)
                                          toast.error('Failed to download file')
                                        }
                                      } catch (error) {
                                        console.error('Download error:', error)
                                        toast.error('Error downloading file')
                                      }
                                    }}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mr-4 bg-transparent border-none cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download {displayName || `File ${index + 1}`}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Existing Grade */}
                        {submission.isGraded && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800 mb-2">Grade Information</h4>
                            <p className="text-sm text-green-700">
                              Grade: {submission.grade}/{submission.assignment.maxPoints}
                            </p>
                            {submission.feedback && (
                              <p className="text-sm text-green-700 mt-1">
                                Feedback: {submission.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grading Section */}
                    {!submission.isGraded && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Submission</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grade (0-{submission.assignment.maxPoints})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={submission.assignment.maxPoints}
                              value={formData.grade}
                              onChange={(e) => handleGradeChange(submission._id, 'grade', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter grade"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback (Optional)
                            </label>
                            <textarea
                              value={formData.feedback}
                              onChange={(e) => handleGradeChange(submission._id, 'feedback', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Provide feedback to the student..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={() => submitGrade(submission._id)}
                            disabled={grading === submission._id || !formData.grade}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {grading === submission._id ? 'Submitting Grade...' : 'Submit Grade'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

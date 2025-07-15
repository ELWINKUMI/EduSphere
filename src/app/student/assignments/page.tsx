'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Clock, FileText, Download, Upload, Calendar, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  maxPoints: number
  attachments: string[]
  course: {
    title: string
    subject: string
    gradeLevel: string
  }
  teacher: {
    name: string
  }
  submitted?: boolean
  submissionData?: {
    submittedAt: string
    files: string[]
    grade?: number
    feedback?: string
  }
}

export default function StudentAssignmentsPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File[]}>({})

  useEffect(() => {
    fetchAssignments()
  }, [])

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
        setAssignments(data.assignments)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (assignmentId: string, files: FileList | null) => {
    if (files) {
      setSelectedFiles(prev => ({
        ...prev,
        [assignmentId]: Array.from(files)
      }))
    }
  }

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`)
      }

      const data = await response.json()
      return data.url
    })

    return Promise.all(uploadPromises)
  }

  const submitAssignment = async (assignmentId: string) => {
    const files = selectedFiles[assignmentId] || []
    
    if (files.length === 0) {
      toast.error('Please select at least one file to submit')
      return
    }

    setSubmitting(assignmentId)

    try {
      // Upload files first
      const fileUrls = await uploadFiles(files)

      const token = localStorage.getItem('token')
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignmentId,
          files: fileUrls
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Assignment submitted successfully!')
        fetchAssignments() // Refresh assignments
        setSelectedFiles(prev => {
          const updated = { ...prev }
          delete updated[assignmentId]
          return updated
        })
      } else {
        toast.error(data.error || 'Failed to submit assignment')
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error('Failed to submit assignment')
    } finally {
      setSubmitting(null)
    }
  }

  const downloadFile = (fileUrl: string, fileName?: string) => {
    const token = localStorage.getItem('token')
    
    // Extract filename from URL if it contains path separators
    const filename = fileUrl.includes('/') ? fileUrl.split('/').pop() : fileUrl
    
    // Use the assignments download API
    const link = document.createElement('a')
    link.href = `/api/assignments/download/${filename}?token=${token}`
    if (fileName) {
      link.download = fileName
    }
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900/90 shadow-sm border-b dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
              <p className="text-gray-600 dark:text-gray-300">View and submit your assignments</p>
            </div>
            <Link
              href="/student/dashboard"
              className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-700 text-sm bg-blue-100 dark:bg-blue-900/20 rounded shadow transition-colors"
              title="Back to Dashboard"
            >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
            <p className="mt-1 text-sm text-gray-500">No assignments available for your grade level.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white dark:bg-gray-800/80 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Link 
                          href={`/student/assignments/${assignment._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {assignment.title}
                        </Link>
                        {assignment.submitted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Submitted
                          </span>
                        ) : isOverdue(assignment.dueDate) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overdue
                          </span>
                        ) : getDaysUntilDue(assignment.dueDate) <= 1 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Due Soon
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Course:</strong> {assignment.course.title} ({assignment.course.subject})
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Teacher:</strong> {assignment.teacher.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <strong>Due:</strong> {formatDate(assignment.dueDate)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Points:</strong> {assignment.maxPoints}
                        </p>
                      </div>

                      <p className="mt-3 text-gray-700 dark:text-gray-200">{assignment.description}</p>

                      {/* Assignment Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignment Files:</h4>
                          <div className="space-y-2">
                            {assignment.attachments.filter(url => url && typeof url === 'string').map((url, index) => {
                              const fileName = url?.split('/').pop() || `Assignment File ${index + 1}`
                              return (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{fileName}</span>
                                  </div>
                                  <button
                                    onClick={() => downloadFile(url, fileName)}
                                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Submission Status */}
                      {assignment.submitted && assignment.submissionData && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 mb-2">Submission Details</h4>
                          <p className="text-sm text-green-700">
                            Submitted on: {formatDate(assignment.submissionData.submittedAt)}
                          </p>
                          {assignment.submissionData.grade !== undefined && (
                            <p className="text-sm text-green-700">
                              Grade: {assignment.submissionData.grade}/{assignment.maxPoints}
                            </p>
                          )}
                          {assignment.submissionData.feedback && (
                            <p className="text-sm text-green-700 mt-1">
                              Feedback: {assignment.submissionData.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <Link
                      href={`/student/assignments/${assignment._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Details & Submit
                    </Link>
                    
                    {assignment.submitted && (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ Assignment Submitted
                      </span>
                    )}
                  </div>

                  {/* Legacy Submission Section - Keep for backward compatibility but encourage using detail page */}
                  {!assignment.submitted && !isOverdue(assignment.dueDate) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Click "View Details & Submit" above for a better submission experience with file downloads and detailed feedback.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

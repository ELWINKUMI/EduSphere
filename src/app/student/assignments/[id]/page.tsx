'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  BookOpen,
  Infinity as InfinityIcon
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  startDate: string
  maxPoints: number
  attachments: string[]
  submissionType: 'file' | 'text' | 'both'
  attempts: number // max allowed attempts (999 means unlimited)
  course: {
    _id: string
    title: string
    subject: string
    gradeLevel: string
  }
  teacher: {
    _id: string
    name: string
  }
  isActive: boolean
}

interface Submission {
  _id: string
  content: string
  files: string[]
  submittedAt: string
  grade?: number
  feedback?: string
  gradedAt?: string
  isGraded: boolean
  isLate: boolean
}

interface AssignmentDetailApi {
  assignment: Assignment
  submissions: Submission[] // all attempts by this student
}

export default function StudentAssignmentDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submissionContent, setSubmissionContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails()
    }
  }, [assignmentId])

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/assignments/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data: AssignmentDetailApi = await response.json()
        setAssignment(data.assignment)
        setSubmissions(data.submissions || [])
        if (data.submissions && data.submissions.length > 0) {
          setSubmissionContent(data.submissions[data.submissions.length-1].content || '')
        }
      } else if (response.status === 404) {
        toast.error('Assignment not found')
        router.push('/student/assignments')
      } else {
        toast.error('Failed to load assignment details')
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error)
      toast.error('Error loading assignment details')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleSubmission = async () => {
    // Validate based on submission type
    if (assignment?.submissionType === 'text' && !submissionContent.trim()) {
      toast.error('Please enter your submission content')
      return
    }
    
    if (assignment?.submissionType === 'file' && selectedFiles.length === 0) {
      toast.error('Please select at least one file to submit')
      return
    }
    
    if (assignment?.submissionType === 'both' && !submissionContent.trim() && selectedFiles.length === 0) {
      toast.error('Please provide either text content or upload files')
      return
    }

    setSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('content', submissionContent)
      
      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions((prev) => [...prev, data.submission])
        setSelectedFiles([])
        setSubmissionContent('')
        toast.success('Assignment submitted successfully!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to submit assignment')
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error('Error submitting assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const downloadFile = (fileUrl: string, fileName: string, isSubmissionFile = false) => {
    const token = localStorage.getItem('token')
    
    if (isSubmissionFile) {
      // For submission files, fileUrl is just the filename
      const link = document.createElement('a')
      link.href = `/api/submissions/download/${fileUrl}?token=${token}`
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // For assignment files, use the assignments download API
      const filename = fileUrl.split('/').pop()
      const link = document.createElement('a')
      link.href = `/api/assignments/download/${filename}?token=${token}`
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  const latestSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;
  const attemptsAllowed = assignment?.attempts ?? 1;
  const attemptsUsed = submissions.length;
  const isOverdue = assignment && new Date() > new Date(assignment.dueDate);
  const hasAttemptsLeft = attemptsAllowed === 999 || attemptsUsed < attemptsAllowed;
  const canSubmit = assignment && assignment.isActive && hasAttemptsLeft && !isOverdue;
  const submission = latestSubmission;

  // Debug logging
  console.log('Assignment data:', {
    assignment: assignment ? {
      title: assignment.title,
      submissionType: assignment.submissionType,
      dueDate: assignment.dueDate,
      isActive: assignment.isActive,
      attempts: assignment.attempts
    } : null,
    submissionsCount: submissions.length,
    attemptsAllowed,
    attemptsUsed,
    canSubmit,
    isOverdue
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The assignment you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/student/assignments"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        </div>
      </div>
    )
  }

  // Remove duplicate submissions by _id before rendering
  const uniqueSubmissions = submissions.filter(
    (sub, idx, arr) => arr.findIndex(s => s._id === sub._id) === idx
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/student/assignments"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {assignment.course.title} • {assignment.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {submissions.length > 0 ? (
                <span className="flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Submitted
                </span>
              ) : isOverdue ? (
                <span className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Overdue
                </span>
              ) : (
                <span className="flex items-center px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Start Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Due Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Max Points:</span>
                  <p className="text-gray-600 dark:text-gray-400">{assignment.maxPoints}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {assignment.course.subject} • {assignment.course.gradeLevel}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment Files */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Files</h3>
                <div className="space-y-3">
                  {assignment.attachments
                    .filter((attachment) => attachment && typeof attachment === 'string')
                    .map((attachment, index) => {
                      const fileName = attachment.split('/').pop() || `File ${index + 1}`
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500 mr-3" />
                            <span className="text-gray-900 dark:text-white">{fileName}</span>
                          </div>
                        <button
                          onClick={() => {
                            const filename = attachment.split('/').pop() || fileName
                            downloadFile(filename, fileName, false)
                          }}
                          className="flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Attempts Info */}
            <div className="mb-4 flex flex-col gap-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 mr-2">
                Attempts Used: {attemptsAllowed === 999 ? `${attemptsUsed}` : `${attemptsUsed} / ${attemptsAllowed}`}
              </span>
              {!hasAttemptsLeft && (
                <div className="text-red-600 font-semibold">
                  You have used all your allowed attempts for this assignment.
                </div>
              )}
              {isOverdue && (
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                  Assignment is overdue
                </span>
              )}
            </div>

            {/* Submission Form */}
            {!hasAttemptsLeft && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm font-semibold">
                You have used all your allowed attempts for this assignment.<br />
                Attempts Used: {attemptsUsed} / {attemptsAllowed}
              </div>
            )}
            {canSubmit && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Your Assignment</h3>
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Submission Type:</strong> {
                      (assignment.submissionType || 'both') === 'both' ? 'Text and File submissions allowed' :
                      (assignment.submissionType || 'both') === 'file' ? 'File submission only' :
                      'Text submission only'
                    }
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {attemptsAllowed === 999
                      ? 'You have unlimited attempts remaining.'
                      : `You have ${Math.max(attemptsAllowed - attemptsUsed, 0)} attempt(s) remaining.`}
                  </p>
                </div>
                <div className="space-y-4">
                  {((assignment.submissionType || 'both') === 'text' || (assignment.submissionType || 'both') === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Submission Content {(assignment.submissionType || 'both') === 'text' ? '*' : ''}
                      </label>
                      <textarea
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={(assignment.submissionType || 'both') === 'text' ? "Enter your assignment response here..." : "Optional: Add text content to your submission..."}
                        required={(assignment.submissionType || 'both') === 'text'}
                      />
                    </div>
                  )}
                  {((assignment.submissionType || 'both') === 'file' || (assignment.submissionType || 'both') === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Attach Files {(assignment.submissionType || 'both') === 'file' ? '*' : '(Optional)'}
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelection}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required={(assignment.submissionType || 'both') === 'file'}
                      />
                      {selectedFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Selected files:</p>
                          <ul className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedFiles.map((file, index) => (
                              <li key={index}>• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleSubmission}
                    disabled={
                      submitting ||
                      !hasAttemptsLeft ||
                      ((assignment.submissionType || 'both') === 'text' && !submissionContent.trim()) ||
                      ((assignment.submissionType || 'both') === 'file' && selectedFiles.length === 0) ||
                      ((assignment.submissionType || 'both') === 'both' && !submissionContent.trim() && selectedFiles.length === 0)
                    }
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${!hasAttemptsLeft ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Previous Submissions */}
            {uniqueSubmissions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Submissions</h3>
                <ul className="space-y-4">
                  {uniqueSubmissions.map((sub, idx) => (
                    <li key={sub._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">Attempt {idx + 1}:</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Content:</span>
                        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{sub.content}</p>
                        </div>
                      </div>
                      {sub.files && sub.files.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Files:</span>
                          <ul className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {sub.files.map((file, i) => {
                              const fileName = file.includes('/') ? file.split('/').pop() || `File ${i + 1}` : file
                              return (
                                <li key={i} className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <button
                                    onClick={() => downloadFile(fileName, fileName, true)}
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                  >
                                    {fileName}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                      {sub.isGraded && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Grade:</span>
                          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">{sub.grade}/{assignment.maxPoints}</span>
                          {sub.feedback && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Feedback:</span>
                              <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <p className="text-gray-700 dark:text-gray-300">{sub.feedback}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submission Details */}
            {submission && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Submission</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Submitted At:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Content:</span>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {submission.content}
                      </p>
                    </div>
                  </div>

                  {submission.files && submission.files.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Submitted Files:</span>
                      <div className="mt-2 space-y-2">
                        {submission.files
                          .filter((file) => file && typeof file === 'string')
                          .map((file, index) => {
                            // Handle both full paths and filenames
                            const fileName = file.includes('/') ? file.split('/').pop() || `File ${index + 1}` : file
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-700 dark:text-gray-300">{fileName}</span>
                                <button
                                  onClick={() => downloadFile(fileName, fileName, true)}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}

                  {submission.isGraded && (
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Grade:</span>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {submissions.length > 0 ? submissions[submissions.length-1].grade : '-'} / {assignment.maxPoints}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Graded At:</span>
                          <p className="text-gray-600 dark:text-gray-400">
                            {submission.gradedAt ? new Date(submission.gradedAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      {submission.feedback && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-900 dark:text-white">Teacher Feedback:</span>
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{submission.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.course.subject} • {assignment.course.gradeLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.teacher.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/student/courses/${assignment.course._id}`}
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Course
                </Link>
                <Link
                  href="/student/assignments"
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  All Assignments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
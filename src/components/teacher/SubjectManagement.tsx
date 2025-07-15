'use client'

import { useState, useEffect } from 'react'
import { Edit3, Trash2, Users, Copy, Eye, EyeOff, MoreVertical, BookOpen, Calendar, Code, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Student {
  _id: string
  name: string
  gradeLevel: string
}

interface Subject {
  _id: string
  title: string
  subject: string
  gradeLevel: string
  description: string
  enrollmentCode: string
  maxStudents: number
  currentStudents: number
  students: Student[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EditSubjectData {
  title: string
  description: string
  maxStudents: number
  isActive: boolean
}

export default function SubjectManagement() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editFormData, setEditFormData] = useState<EditSubjectData>({
    title: '',
    description: '',
    maxStudents: 30,
    isActive: true
  })
  const [showDeleteModal, setShowDeleteModal] = useState<Subject | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubjects(data.subjects || [])
      } else {
        toast.error('Failed to load subjects')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      toast.error('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setEditFormData({
      title: subject.title,
      description: subject.description,
      maxStudents: subject.maxStudents,
      isActive: subject.isActive
    })
    setActionMenuOpen(null)
  }

  const handleSaveEdit = async () => {
    if (!editingSubject) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/teacher/subjects/${editingSubject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      })

      if (response.ok) {
        toast.success('Subject updated successfully')
        setEditingSubject(null)
        fetchSubjects() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update subject')
      }
    } catch (error) {
      console.error('Error updating subject:', error)
      toast.error('Failed to update subject')
    }
  }

  const handleDelete = async (subject: Subject) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/teacher/subjects/${subject._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Subject deleted successfully')
        setShowDeleteModal(null)
        fetchSubjects() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete subject')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      toast.error('Failed to delete subject')
    }
  }

  const copyEnrollmentCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Enrollment code copied to clipboard!');
    } catch (err) {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Enrollment code copied!');
    }
    setActionMenuOpen(null);
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'from-blue-500 to-blue-600',
      'English Language': 'from-green-500 to-green-600',
      'Science': 'from-purple-500 to-purple-600',
      'Integrated Science': 'from-purple-500 to-purple-600',
      'Social Studies': 'from-orange-500 to-orange-600',
      'History': 'from-red-500 to-red-600',
      'Geography': 'from-teal-500 to-teal-600',
      'Physics': 'from-indigo-500 to-indigo-600',
      'Chemistry': 'from-pink-500 to-pink-600',
      'Biology': 'from-emerald-500 to-emerald-600',
    }
    return colors[subject as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Subjects</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Subjects</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <p>No subjects created yet.</p>
          <p className="text-sm">Create your first subject to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow bg-white dark:bg-gray-900"
            >
              {/* Subject Header */}
              <div className={`bg-gradient-to-r ${getSubjectColor(subject.subject)} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{subject.title}</h4>
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <span>{subject.subject}</span>
                      <span>•</span>
                      <span>{subject.gradeLevel}</span>
                      <span>•</span>
                      <span>Created {formatDate(subject.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      subject.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.isActive ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === subject._id ? null : subject._id)}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {actionMenuOpen === subject._id && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 py-1 z-20 min-w-[150px] transition-colors duration-200">
                          <button
                            onClick={() => {
                              setActionMenuOpen(null)
                              router.push(`/teacher/courses/${subject._id}`)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Course
                          </button>
                          <button
                            onClick={() => handleEdit(subject)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Subject
                          </button>
                          <button
                            onClick={() => copyEnrollmentCode(subject.enrollmentCode)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(subject)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Subject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Content */}
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{subject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Enrollment Code */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Enrollment Code</p>
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">{subject.enrollmentCode}</p>
                      </div>
                      <button
                        onClick={() => copyEnrollmentCode(subject.enrollmentCode)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Copy code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Students */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Students Enrolled</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {subject.currentStudents}/{subject.maxStudents}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{formatDate(subject.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Edit Subject</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editFormData.maxStudents}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 30 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Subject is active (students can enroll)
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingSubject(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Delete Subject</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{showDeleteModal.title}</strong>?
              </p>
              {showDeleteModal.currentStudents > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Warning:</strong> This subject has {showDeleteModal.currentStudents} enrolled students. 
                    You need to remove all students before deleting the subject.
                  </p>
                </div>
              )}
              <p className="text-red-600 text-sm mb-6">
                This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={showDeleteModal.currentStudents > 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {actionMenuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  FileText,
  X,
  Upload,
  Download,
  Save
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Assignment {
  _id: string
  title: string
  description: string
  course: {
    _id: string
    title: string
    subject: string
    gradeLevel: string
  }
  dueDate: string
  maxPoints: number
  attachments: string[]
  submissionType: 'file' | 'text' | 'both'
  isActive: boolean
  submissionCount?: number
}

interface EditAssignmentData {
  title: string
  description: string
  dueDate: string
  maxPoints: number
  submissionType: 'file' | 'text' | 'both'
  attachments: File[]
  existingAttachments: string[]
}

export default function AssignmentManagement() {
  const { user } = useAuth()
  const { isDark } = useTheme()
  
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState<EditAssignmentData>({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    submissionType: 'both',
    attachments: [],
    existingAttachments: []
  })

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments)
      } else {
        toast.error('Failed to fetch assignments')
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Error fetching assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setEditData({
      title: assignment.title,
      description: assignment.description,
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
      maxPoints: assignment.maxPoints,
      submissionType: assignment.submissionType,
      attachments: [],
      existingAttachments: assignment.attachments
    })
    setShowEditModal(true)
  }

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Assignment deleted successfully')
        fetchAssignments()
      } else {
        toast.error('Failed to delete assignment')
      }
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Error deleting assignment')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingAssignment) return

    const formData = new FormData()
    formData.append('title', editData.title)
    formData.append('description', editData.description)
    formData.append('dueDate', editData.dueDate)
    formData.append('maxPoints', editData.maxPoints.toString())
    formData.append('submissionType', editData.submissionType)
    formData.append('existingAttachments', JSON.stringify(editData.existingAttachments))

    editData.attachments.forEach(file => {
      formData.append('attachments', file)
    })

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/assignments/${editingAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast.success('Assignment updated successfully')
        setShowEditModal(false)
        setEditingAssignment(null)
        fetchAssignments()
      } else {
        toast.error('Failed to update assignment')
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
      toast.error('Error updating assignment')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
      }))
    }
  }

  const removeNewFile = (index: number) => {
    setEditData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const removeExistingFile = (filename: string) => {
    setEditData(prev => ({
      ...prev,
      existingAttachments: prev.existingAttachments.filter(f => f !== filename)
    }))
  }

  const downloadFile = (filename: string) => {
    window.open(`/api/assignments/download/${filename}`, '_blank')
  }

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Assignment Management
          </h2>
        </div>
        <button
          onClick={() => window.location.href = '/teacher/assignments/create'}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No assignments found. Create your first assignment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className={`p-4 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {assignment.title}
                  </h3>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {assignment.course.subject} - Grade {assignment.course.gradeLevel}
                  </p>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {assignment.submissionCount || 0} submissions
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {assignment.maxPoints} pts
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assignment.submissionType === 'file' 
                        ? 'bg-blue-100 text-blue-800' 
                        : assignment.submissionType === 'text'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {assignment.submissionType === 'both' ? 'File & Text' : assignment.submissionType}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'hover:bg-gray-600 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'hover:bg-red-600 text-gray-300 hover:text-white' 
                        : 'hover:bg-red-100 text-gray-500 hover:text-red-700'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && editingAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Edit Assignment
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={editData.dueDate}
                      onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Max Points
                    </label>
                    <input
                      type="number"
                      value={editData.maxPoints}
                      onChange={(e) => setEditData(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Submission Type
                  </label>
                  <select
                    value={editData.submissionType}
                    onChange={(e) => setEditData(prev => ({ 
                      ...prev, 
                      submissionType: e.target.value as 'file' | 'text' | 'both'
                    }))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="both">File & Text</option>
                    <option value="file">File Only</option>
                    <option value="text">Text Only</option>
                  </select>
                </div>

                {/* Existing Files */}
                {editData.existingAttachments.length > 0 && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Files
                    </label>
                    <div className="space-y-2">
                      {editData.existingAttachments.map((filename, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 border rounded-lg ${
                          isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                        }`}>
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {filename}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadFile(filename)}
                              className={`p-1 rounded transition-colors ${
                                isDark 
                                  ? 'hover:bg-gray-600 text-gray-400' 
                                  : 'hover:bg-gray-200 text-gray-500'
                              }`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeExistingFile(filename)}
                              className={`p-1 rounded transition-colors ${
                                isDark 
                                  ? 'hover:bg-red-600 text-gray-400' 
                                  : 'hover:bg-red-100 text-gray-500'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Files */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Add New Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  {editData.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {editData.attachments.map((file, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 border rounded-lg ${
                          isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                        }`}>
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeNewFile(index)}
                            className={`p-1 rounded transition-colors ${
                              isDark 
                                ? 'hover:bg-red-600 text-gray-400' 
                                : 'hover:bg-red-100 text-gray-500'
                            }`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

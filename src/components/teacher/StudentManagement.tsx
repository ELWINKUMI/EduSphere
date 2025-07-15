'use client'


import { useState, useEffect } from 'react'
import { Plus, Eye, EyeOff, Users, Trash2, UserX, BookOpen, AlertTriangle } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { ALL_GRADES } from '@/lib/schoolConfig'
import toast from 'react-hot-toast'

interface Student {
  _id: string
  name: string
  pin: string
  userId?: string
  gradeLevel: string
  createdAt: string
}

interface EnrolledStudent {
  _id: string
  name: string
  gradeLevel: string
  enrolledSubjects: Array<{
    _id: string
    title: string
    subject: string
    gradeLevel: string
  }>
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  // ...removed generateId state and logic...
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPins, setShowPins] = useState<{[key: string]: boolean}>({})
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('enrolled')
  const [studentToRemove, setStudentToRemove] = useState<{student: EnrolledStudent, subject: any} | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    gradeLevel: ''
  })
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/students/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId })
      })
      if (response.ok) {
        toast.success('Student deleted successfully!')
        fetchStudents()
        setStudentToDelete(null)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete student')
      }
    } catch (error) {
      toast.error('Error deleting student')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchEnrolledStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched students:', data.students)
        setStudents(data.students)
      } else {
        toast.error('Failed to fetch students')
      }
    } catch (error) {
      toast.error('Error fetching students')
    }
  }

  const fetchEnrolledStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/teacher/enrolled-students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEnrolledStudents(data.students || [])
      } else {
        toast.error('Failed to fetch enrolled students')
      }
    } catch (error) {
      toast.error('Error fetching enrolled students')
    }
  }

  const generatePin = () => {
    const pin = Math.floor(10000 + Math.random() * 90000).toString()
    setFormData(prev => ({ ...prev, pin }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.pin || !formData.gradeLevel) {
      toast.error('Please fill in all fields')
      return
    }

    if (!/^[0-9]{5}$/.test(formData.pin)) {
      toast.error('PIN must be exactly 5 digits')
      return
    }

    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Student created successfully!')
        setFormData({ name: '', pin: '', gradeLevel: '' })
        setShowCreateForm(false)
        fetchStudents()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to create student')
      }
    } catch (error) {
      toast.error('Error creating student')
    }
    
    setLoading(false)
  }

  const togglePinVisibility = (studentId: string) => {
    setShowPins(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const copyCredentials = async (student: Student) => {
    const credentials = `User ID: ${student.userId || '[Not generated]'}\nPIN: ${student.pin}\nName: ${student.name}`
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(credentials)
        toast.success('Credentials copied to clipboard!')
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = credentials
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          toast.success('Credentials copied to clipboard!')
        } catch (err) {
          alert(`Student Login Credentials:\n\n${credentials}`)
          toast.success('Credentials displayed - please copy manually')
        }
        document.body.removeChild(textArea)
      }
    } catch (err) {
      alert(`Student Login Credentials:\n\n${credentials}`)
      toast.success('Credentials displayed - please copy manually')
    }
  }

  const handleRemoveStudent = async (studentId: string, subjectId: string) => {
  const handleDeleteStudent = async (studentId: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/students/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId })
      })
      if (response.ok) {
        toast.success('Student deleted successfully!')
        fetchStudents()
        setStudentToDelete(null)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete student')
      }
    } catch (error) {
      toast.error('Error deleting student')
    } finally {
      setLoading(false)
    }
  }
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/teacher/remove-student', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, subjectId })
      })

      if (response.ok) {
        toast.success('Student removed from subject successfully!')
        fetchEnrolledStudents() // Refresh the enrolled students list
        setStudentToRemove(null)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove student')
      }
    } catch (error) {
      toast.error('Error removing student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Students</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'enrolled'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Enrolled Students ({enrolledStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          All Students ({students.length})
        </button>
      </div>

      {/* Create Student Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Create New Student</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Student Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter student's full name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade Level
                </label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradeLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Grade Level</option>
                  <optgroup label="Primary School">
                    {ALL_GRADES.slice(0, 6).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Junior High School">
                    {ALL_GRADES.slice(6, 9).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Senior High School">
                    {ALL_GRADES.slice(9, 12).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <Input
                  label="5-Digit PIN"
                  value={formData.pin}
                  onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="Enter 5-digit PIN"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  required
                />
                <button
                  type="button"
                  onClick={generatePin}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Generate Random PIN
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({ name: '', pin: '', gradeLevel: '' })
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'enrolled' ? (
        // Enrolled Students Tab
        <div>
          {enrolledStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No students enrolled in your subjects yet.</p>
              <p className="text-sm">Students will appear here when they join your subjects using the subject codes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledStudents.map((student) => (
                <div key={student._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        {student.gradeLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enrolled Subjects ({student.enrolledSubjects.length}):
                    </p>
                    {student.enrolledSubjects.map((subject) => (
                      <div key={subject._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{subject.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subject.subject} • {subject.gradeLevel}
                          </p>
                        </div>
                        <button
                          onClick={() => setStudentToRemove({ student, subject })}
                          className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // All Students Tab
        <div>
          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No students created yet.</p>
              <p className="text-sm">Click "Add Student" to create your first student.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        {student.gradeLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">{student.userId}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">PIN:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {showPins[student._id] ? student.pin : '•••••'}
                      </span>
                      <button
                        onClick={() => togglePinVisibility(student._id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPins[student._id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      View Credentials
                    </button>
                    <button
                      onClick={() => copyCredentials(student)}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      Copy Login Info
                    </button>
                    <button
                      onClick={() => setStudentToDelete(student)}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center"
                      title="Delete Student"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>
      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Student</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>permanently delete</strong> <strong>{studentToDelete.name}</strong> from the system? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(studentToDelete._id)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Remove Student Confirmation Modal */}
      {studentToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remove Student</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove <strong>{studentToRemove.student.name}</strong> from 
              <strong> {studentToRemove.subject.title}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStudentToRemove(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveStudent(studentToRemove.student._id, studentToRemove.subject._id)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Removing...
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Remove Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Login Credentials</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">User ID:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.userId || <span className='text-red-500'>Not generated</span>}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">PIN:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.pin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Student Name:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Grade Level:</label>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedStudent.gradeLevel}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Instructions for student:</strong><br />
                1. Go to the login page<br />
                2. Enter the <strong>User ID</strong> and <strong>PIN</strong> as shown above<br />
                3. Click "Sign In"
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  copyCredentials(selectedStudent)
                  setSelectedStudent(null)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copy & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

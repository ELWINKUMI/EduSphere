'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Trophy, TrendingUp, FileText, Clock, Award, Target } from 'lucide-react'
import Link from 'next/link'

interface Grade {
  _id: string
  assignment: {
    title: string
    maxPoints: number
    course: {
      title: string
      subject: string
    }
  }
  grade: number
  feedback?: string
  submittedAt: string
  gradedAt: string
}

interface GradeStats {
  totalAssignments: number
  gradedAssignments: number
  averageGrade: number
  totalPoints: number
  earnedPoints: number
  highestGrade: number
  lowestGrade: number
}

export default function StudentGradesPage() {
  const { user } = useAuth()
  const [grades, setGrades] = useState<Grade[]>([])
  const [stats, setStats] = useState<GradeStats>({
    totalAssignments: 0,
    gradedAssignments: 0,
    averageGrade: 0,
    totalPoints: 0,
    earnedPoints: 0,
    highestGrade: 0,
    lowestGrade: 0
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, recent, subject

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/grades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGrades(data.grades || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getGradeColor = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100
    if (percentage >= 90) return 'text-green-600 bg-green-100'
    if (percentage >= 80) return 'text-blue-600 bg-blue-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    if (percentage >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getLetterGrade = (grade: number, maxPoints: number) => {
    const percentage = (grade / maxPoints) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'B+'
    if (percentage >= 75) return 'B'
    if (percentage >= 70) return 'C+'
    if (percentage >= 65) return 'C'
    if (percentage >= 60) return 'D+'
    if (percentage >= 55) return 'D'
    return 'F'
  }

  const filteredGrades = grades.filter(grade => {
    if (filter === 'recent') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(grade.gradedAt) >= weekAgo
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading grades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Grades
              </h1>
              <p className="text-gray-600">Track your academic progress and performance</p>
            </div>
            <Link
              href="/student/dashboard"
              className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageGrade > 0 ? `${stats.averageGrade.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Graded Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.gradedAssignments}/{stats.totalAssignments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.earnedPoints}/{stats.totalPoints}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.highestGrade > 0 ? `${stats.highestGrade}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Filter Tabs */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Grade History</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'recent' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>
          </div>

          {/* Grades List */}
          <div className="p-6">
            {filteredGrades.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Grades Yet</h3>
                <p className="text-gray-600">
                  Your assignment grades will appear here once teachers have graded your submissions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGrades.map((grade) => (
                  <div
                    key={grade._id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {grade.assignment.title}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.grade, grade.assignment.maxPoints)}`}>
                            {getLetterGrade(grade.grade, grade.assignment.maxPoints)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="font-medium">
                            {grade.assignment.course.subject} - {grade.assignment.course.title}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Graded {formatDate(grade.gradedAt)}
                          </span>
                        </div>

                        {grade.feedback && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Teacher Feedback:</strong> {grade.feedback}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {grade.grade}/{grade.assignment.maxPoints}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((grade.grade / grade.assignment.maxPoints) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

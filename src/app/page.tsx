import Link from 'next/link'
import { BookOpen, Users, Calendar, FileText, Award, Bell } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">EduSphere</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="text-blue-600"> Learning Experience</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EduSphere is a comprehensive Learning Management System designed to streamline 
            education with powerful tools for teachers and engaging experiences for students.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Modern Education
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-blue-600" />}
              title="Assignment Management"
              description="Create, distribute, and track assignments with customizable deadlines and automatic reminders."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-green-600" />}
              title="Timed Quizzes"
              description="Interactive quizzes with countdown timers, auto-submission, and instant or delayed result display."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-purple-600" />}
              title="Resource Sharing"
              description="Share videos, PDFs, documents, and other educational materials with students effortlessly."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-orange-600" />}
              title="Grading System"
              description="Comprehensive grading tools with feedback, analytics, and progress tracking."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-red-600" />}
              title="Announcements"
              description="Real-time notifications and announcements to keep everyone informed and engaged."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-indigo-600" />}
              title="Course Management"
              description="Organize courses, manage enrollments, and track student progress all in one place."
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">500+</div>
              <div className="text-gray-600">Teachers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Schools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 EduSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h4 className="text-xl font-semibold text-gray-900 ml-3">{title}</h4>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

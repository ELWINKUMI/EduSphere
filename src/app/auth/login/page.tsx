'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !pin) {
      toast.error('Please fill in all fields')
      return
    }

    if (pin.length !== 5 || !/^[0-9]{5}$/.test(pin)) {
      toast.error('PIN must be exactly 5 digits')
      return
    }

    setLoading(true)
    
    try {
      const success = await login(name, pin)
      if (success) {
        toast.success('Login successful!')
      } else {
        toast.error('Invalid name or PIN')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in with your name and PIN</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <Input
            type="text"
            id="pin"
            label="5-Digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your 5-digit PIN"
            maxLength={5}
            pattern="[0-9]{5}"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact your teacher for your login credentials.
          </p>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mt-4 block">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

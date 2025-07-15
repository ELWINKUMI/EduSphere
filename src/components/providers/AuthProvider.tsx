'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  role: 'teacher' | 'student'
  avatar?: string
  teacherId?: string
  teacherName?: string
  email?: string
  firstLogin?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userId: string, pin: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showInactivityModal, setShowInactivityModal] = useState(false)
  const inactivityTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const modalTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Inactivity modal and timer helpers must be defined before use
  let hasLoggedOut = false;

  const handleLogout = () => {
    if (!hasLoggedOut) {
      hasLoggedOut = true;
      setShowInactivityModal(false);
      logout();
    }
  };

  const showModal = () => {
    hasLoggedOut = false; // Reset so handleLogout works for every modal open
    setShowInactivityModal(true);
    // Start modal timer (60 seconds for production)
    if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
    modalTimeoutId.current = setTimeout(() => {
      handleLogout();
    }, 60000);
  };

  const resetTimer = () => {
    if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
    if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
    setShowInactivityModal(false);
    if (user) {
      inactivityTimeoutId.current = setTimeout(showModal, 300000); // 5 minutes for production
    }
  };

  // Inactivity logout timer (5 minutes = 300000 ms)
  useEffect(() => {
    checkAuth();

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    // If user becomes null (logged out), clear timers
    if (!user) {
      if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
      if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
      setShowInactivityModal(false);
      hasLoggedOut = false;
    }

    return () => {
      if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
      if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
      setShowInactivityModal(false);
      hasLoggedOut = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Start inactivity timer immediately when user is set
  useEffect(() => {
    if (user) {
      resetTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const text = await response.text()
          if (text) {
            try {
              const userData = JSON.parse(text)
              setUser(prev => {
                if (!prev || JSON.stringify(prev) !== JSON.stringify(userData.user)) {
                  return userData.user
                }
                return prev
              })
            } catch (parseError) {
              console.error('Failed to parse auth response:', parseError)
              localStorage.removeItem('token')
              setUser(null)
            }
          } else {
            localStorage.removeItem('token')
            setUser(null)
          }
        } else {
          localStorage.removeItem('token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userId: string, pin: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, pin })
      })

      if (response.ok) {
        const text = await response.text()
        if (text) {
          try {
            const data = JSON.parse(text)
            localStorage.setItem('token', data.token)
            setUser(data.user)
            router.push(`/${data.user.role}/dashboard`)
            return true
          } catch (parseError) {
            console.error('Failed to parse login response:', parseError)
            return false
          }
        }
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  // Expose a method to refresh user data (after profile update)
  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
      {showInactivityModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full text-center">
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Session Expiring</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">You have been inactive for a while.<br />Do you want to stay logged in?</p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={() => {
                  if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
                  setShowInactivityModal(false);
                  // Reset inactivity timer
                  if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
                  inactivityTimeoutId.current = setTimeout(showModal, 300000);
                }}
              >
                Stay Logged In
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
                onClick={() => {
                  if (modalTimeoutId.current) clearTimeout(modalTimeoutId.current);
                  setShowInactivityModal(false);
                  logout();
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

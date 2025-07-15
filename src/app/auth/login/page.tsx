'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export default function LoginPage() {
  const [userId, setUserId] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  // Change PIN modal state
  const [showChangePin, setShowChangePin] = useState(false)
  const [changePinStep, setChangePinStep] = useState<'verify' | 'set'>('verify')
  const [changePinUserId, setChangePinUserId] = useState('')
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')
  const [changePinLoading, setChangePinLoading] = useState(false)
  const [changePinError, setChangePinError] = useState('')
  const [changePinSuccess, setChangePinSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId || !pin) {
      toast.error('Please fill in all fields')
      return
    }
    if (userId.length !== 8 || !/^[0-9]{8}$/.test(userId)) {
      toast.error('Login ID must be exactly 8 digits')
      return
    }
    if (pin.length !== 5 || !/^[0-9]{5}$/.test(pin)) {
      toast.error('PIN must be exactly 5 digits')
      return
    }
    setLoading(true)
    try {
      const success = await login(userId, pin)
      if (success) {
        toast.success('Login successful!')
      } else {
        toast.error('Invalid ID or PIN')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
    setLoading(false)
  }

  // Generate random values for particles and shapes only on the client
  const [particles, setParticles] = useState<{left: string, top: string, delay: string, duration: string}[]>([]);
  const [shapes, setShapes] = useState<{style: React.CSSProperties, className: string}[]>([]);

  useEffect(() => {
    // Only run on client
    const newParticles = Array.from({length: 50}).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 3 + 3}s`,
    }));
    setParticles(newParticles);
    setShapes([
      {
        className: "absolute top-[10%] left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-[#745af2] to-[#5b47e8] opacity-10 animate-drift",
        style: { animationDelay: '0s' },
      },
      {
        className: "absolute top-[60%] right-[15%] w-16 h-16 opacity-10 animate-drift",
        style: { background: 'linear-gradient(45deg, #e84393, #fd79a8)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', animationDelay: '-5s' },
      },
      {
        className: "absolute bottom-[20%] left-[20%] w-24 h-24 opacity-10 animate-drift",
        style: { background: 'linear-gradient(45deg, #00b894, #00cec9)', clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)', animationDelay: '-10s' },
      },
    ]);
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 transition-colors">
        {/* Animated background particles */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[rgba(116,90,242,0.3)] animate-float"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
          {/* Floating geometric shapes */}
          {shapes.map((shape, i) => (
            <div key={i} className={shape.className} style={shape.style} />
          ))}
          {/* Pulsing glow effect */}
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(116,90,242,0.1)_0%,transparent_70%)] animate-pulse-glow z-0" style={{transform: 'translate(-50%, -50%)'}} />
        </div>
        <div className="relative z-10 max-w-md w-full bg-white/90 dark:bg-[rgba(30,39,62,0.95)] backdrop-blur-xl border border-[rgba(116,90,242,0.2)] dark:border-gray-800 rounded-2xl shadow-2xl p-2 md:p-4 flex flex-col gap-2 min-h-0 transition-colors">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-3 rounded-full shadow-lg">
              <BookOpen className="h-8 w-8 text-white drop-shadow" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">EduSphere Login</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1 transition-colors">Sign in with your Login ID and PIN</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            type="text"
            id="userId"
            label="ENTER YOUR ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID"
            maxLength={8}
            pattern="[0-9]{8}"
            required
          />
          <Input
            type="password"
            id="pin"
            label="ENTER PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            maxLength={5}
            pattern="[0-9]{5}"
            required
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow"
          >
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-blue-400 rounded-full inline-block"></span> : null}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col gap-2 transition-colors">
          <div className="flex flex-row gap-4 justify-center">
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800 transition-colors focus:outline-none"
              style={{ boxShadow: 'none', border: 'none' }}
              onClick={async () => {
                if (!userId || userId.length !== 8 || !/^[0-9]{8}$/.test(userId)) {
                  toast.error('Please enter your Login ID above first.');
                  return;
                }
                try {
                  const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                  });
                  if (res.ok) {
                    toast.success('If your account exists, a password reset link has been sent to your registered email.');
                  } else {
                    const data = await res.json().catch(() => ({}));
                    toast.error(data.message || 'Failed to send password reset email.');
                  }
                } catch {
                  toast.error('Failed to send password reset email. Please try again.');
                }
              }}
            >
              Forgot PIN?
            </button>
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none"
              style={{ boxShadow: 'none', border: 'none' }}
              onClick={() => {
                setShowChangePin(true);
                setChangePinStep('verify');
                setChangePinUserId('');
                setOldPin('');
                setNewPin('');
                setConfirmNewPin('');
                setChangePinError('');
                setChangePinSuccess('');
              }}
            >
              Change PIN
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors">
            Need help? Contact your your admin for assistance.
          </p>
          <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4 block transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>

    {/* Change PIN Modal */}
    <Modal open={showChangePin} onClose={() => setShowChangePin(false)} title="Change PIN">
      {changePinSuccess ? (
        <div className="text-green-600 text-center font-semibold py-4">{changePinSuccess}</div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setChangePinError('');
            if (changePinStep === 'verify') {
              if (!changePinUserId || !oldPin) {
                setChangePinError('Please enter your Login ID and old PIN.');
                return;
              }
              if (changePinUserId.length !== 8 || !/^[0-9]{8}$/.test(changePinUserId)) {
                setChangePinError('Login ID must be exactly 8 digits.');
                return;
              }
              if (oldPin.length !== 5 || !/^[0-9]{5}$/.test(oldPin)) {
                setChangePinError('PIN must be exactly 5 digits.');
                return;
              }
              setChangePinLoading(true);
              try {
                // Verify credentials (reuse login endpoint for verification)
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: changePinUserId, pin: oldPin }),
                });
                if (res.ok) {
                  setChangePinStep('set');
                } else {
                  setChangePinError('Invalid Login ID or old PIN.');
                }
              } catch {
                setChangePinError('Failed to verify credentials.');
              } finally {
                setChangePinLoading(false);
              }
            } else if (changePinStep === 'set') {
              if (!newPin || !confirmNewPin) {
                setChangePinError('Please enter and confirm your new PIN.');
                return;
              }
              if (newPin.length !== 5 || !/^[0-9]{5}$/.test(newPin)) {
                setChangePinError('New PIN must be exactly 5 digits.');
                return;
              }
              if (newPin !== confirmNewPin) {
                setChangePinError('PINs do not match.');
                return;
              }
              setChangePinLoading(true);
              try {
                // Call change-pin endpoint
                const res = await fetch('/api/auth/change-pin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: changePinUserId, oldPin, newPin }),
                });
                if (res.ok) {
                  setChangePinSuccess('PIN changed successfully. You can now log in with your new PIN.');
                } else {
                  const data = await res.json();
                  setChangePinError(data.message || 'Failed to change PIN.');
                }
              } catch {
                setChangePinError('Failed to change PIN.');
              } finally {
                setChangePinLoading(false);
              }
            }
          }}
          className="flex flex-col gap-4"
        >
          {changePinStep === 'verify' && (
            <>
              <Input
                type="text"
                label="8-Digit Login ID"
                value={changePinUserId}
                onChange={e => setChangePinUserId(e.target.value)}
                placeholder="Enter your Login ID"
                maxLength={8}
                pattern="[0-9]{8}"
                required
              />
              <Input
                type="text"
                label="Old PIN"
                value={oldPin}
                onChange={e => setOldPin(e.target.value)}
                placeholder="Enter your old PIN"
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={changePinLoading}
              >
                {changePinLoading ? 'Verifying...' : 'Verify'}
              </button>
            </>
          )}
          {changePinStep === 'set' && (
            <>
              <Input
                type="text"
                label="New PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                placeholder="Enter new 5-digit PIN"
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
              <Input
                type="text"
                label="Confirm New PIN"
                value={confirmNewPin}
                onChange={e => setConfirmNewPin(e.target.value)}
                placeholder="Confirm new 5-digit PIN"
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={changePinLoading}
              >
                {changePinLoading ? 'Changing PIN...' : 'Change PIN'}
              </button>
            </>
          )}
          {changePinError && <div className="text-red-600 text-sm font-medium text-center">{changePinError}</div>}
        </form>
      )}
    </Modal>
    </>
  )
}

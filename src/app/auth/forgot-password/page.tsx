"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("If your email is registered, a password reset link has been sent.");
      } else {
        setError(data.message || "Failed to send reset email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 px-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Enter your registered email address and we'll send you a link to reset your password.</p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
          {success && <div className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <button
          type="button"
          className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
          onClick={() => router.push("/auth/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

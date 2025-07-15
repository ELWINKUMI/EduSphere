"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { LogOut, Save, User, Mail, Lock, Loader2 } from "lucide-react";

// ...existing code...
export default function StudentProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/auth/login");
    } else if (user) {
      setForm({ name: user.name || "", email: user.email || "", password: "", confirmPassword: "" });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    if (showPasswordFields && form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: showPasswordFields && form.password ? form.password : undefined,
        }),
      });
      if (res.ok) {
        setSuccess("Profile updated successfully.");
        setEditMode(false);
        setShowPasswordFields(false);
        setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
        await refreshUser();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-10 px-4 transition-colors">
      <div className="w-full max-w-xl bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col gap-6 transition-colors">
        {/* Back button */}
        <button
          type="button"
          className="mb-4 w-fit flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          onClick={() => router.push('/student/dashboard')}
        >
          {/* You can use an icon here if desired */}
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Student Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information</p>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Student ID: <span className="font-mono text-gray-900 dark:text-white">{user.userId || 'N/A'}</span></span>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Class: <span className="font-mono text-gray-900 dark:text-white">{user.gradeLevel || 'N/A'}</span></span>
            </div>
          </div>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSave}>
          {/* ...existing code... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="name">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300" />
              <input
                type="text"
                id="name"
                name="name"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                value={form.name}
                onChange={handleChange}
                disabled={!editMode}
                autoComplete="name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300" />
              <input
                type="email"
                id="email"
                name="email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode}
                autoComplete="email"
              />
            </div>
          </div>
          {editMode && (
            <>
              {!showPasswordFields ? (
                <button
                  type="button"
                  className="py-2 px-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors w-fit"
                  onClick={() => setShowPasswordFields(true)}
                >
                  Change Password
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="password">
                      New Password
                    </label>
                    <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      value={form.password}
                      onChange={handleChange}
                      disabled={!editMode}
                      autoComplete="new-password"
                      placeholder="••••••••"
                    />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={!editMode}
                      autoComplete="new-password"
                      placeholder="••••••••"
                    />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors w-fit mt-1"
                    onClick={() => { setShowPasswordFields(false); setForm(f => ({ ...f, password: "", confirmPassword: "" })); setError(""); setSuccess(""); }}
                  >
                    Back
                  </button>
                </>
              )}
            </>
          )}
          {error && <div className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
          {success && <div className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</div>}
          <div className="flex gap-3 mt-2">
            {!editMode ? (
              <button
                type="button"
                className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Save Changes
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => { setEditMode(false); setShowPasswordFields(false); setForm({ name: user.name || "", email: user.email || "", password: "", confirmPassword: "" }); setError(""); setSuccess(""); }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            )}
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center gap-2"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

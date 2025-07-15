// Extend the user type locally to include grades if not present
type UserWithGrades = {
  userId?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  grades?: string[];
  [key: string]: any;
};
"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { LogOut, Save, User, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TeacherProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const typedUser = user as UserWithGrades;
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  // For future: add password fields if needed
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setClassesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/teacher/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setClasses(data.classes || []);
        }
      } catch {}
      setClassesLoading(false);
    };
    if (user && user.role === "teacher") {
      fetchClasses();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/auth/login");
    } else if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully.");
        setEditMode(false);
        await refreshUser();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  const [resetting, setResetting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "teacher") {
    return null;
  }

  const handleResetStats = async () => {
    if (!window.confirm('Are you sure you want to reset all your records and stats for the new term? This cannot be undone.')) return;
    setResetting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/teacher/reset-stats', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Your records and stats have been reset.');
        // Optionally refresh page or user data
        setClasses([]);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to reset records.');
      }
    } catch {
      toast.error('Failed to reset records.');
    }
    setResetting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-10 px-4 transition-colors">
      <div className="w-full max-w-xl bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col gap-6 transition-colors">
        {/* Back button */}
        <button
          type="button"
          className="mb-4 w-fit flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          onClick={() => router.push('/teacher/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Teacher Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information</p>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Teacher ID: <span className="font-mono text-gray-900 dark:text-white">{typedUser.userId || typedUser.id || 'N/A'}</span></span>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Grade{(() => {
                const grades = Array.isArray(typedUser.grades) && typedUser.grades.length > 0
                  ? typedUser.grades
                  : (Array.isArray(classes) && classes.length > 0 && classes[0].gradeLevel ? [classes[0].gradeLevel] : []);
                return grades.length > 1 ? 's' : '';
              })()}: <span className="font-mono text-gray-900 dark:text-white">{
                (() => {
                  const grades = Array.isArray(typedUser.grades) && typedUser.grades.length > 0
                    ? typedUser.grades
                    : (Array.isArray(classes) && classes.length > 0 && classes[0].gradeLevel ? [classes[0].gradeLevel] : []);
                  return grades.length > 0 ? grades.join(', ') : 'N/A';
                })()
              }</span></span>
            </div>
          </div>
        </div>
        {/* Classes Taught */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Classes You Teach</h3>
          </div>
          {classesLoading ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">Loading classes...</div>
          ) : classes.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">You are not teaching any classes yet.</div>
          ) : (
            <ul className="space-y-2">
              {classes.map((cls) => (
                <li key={cls._id} className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">{cls.title}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{cls.subject} • {cls.gradeLevel} {cls.isActive === false && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSave}>
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
          {/* Teacher ID Display (already in header) */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-colors flex items-center gap-2"
              onClick={handleResetStats}
              disabled={resetting}
            >
              {resetting ? <Loader2 className="animate-spin h-5 w-5" /> : <BookOpen className="h-5 w-5" />} Reset My Records
            </button>
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
                  onClick={() => { setEditMode(false); setForm({ name: user.name || "", email: user.email || "" }); }}
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

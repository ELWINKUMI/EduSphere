"use client"

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("student");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subjects, setSubjects] = useState("");
  const [grades, setGrades] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUserId("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          pin,
          role,
          gradeLevel: role === "student" ? gradeLevel : undefined,
          subjects: role === "teacher" ? subjects.split(",").map(s => s.trim()) : undefined,
          grades: role === "teacher" ? grades.split(",").map(g => g.trim()) : undefined,
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId);
        toast.success("Registration successful! Your ID: " + data.userId);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="5-Digit PIN" value={pin} onChange={e => setPin(e.target.value)} maxLength={5} pattern="[0-9]{5}" type="password" required />
        <Input label="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {role === "student" && (
          <Input label="Grade Level" value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} required />
        )}
        {role === "teacher" && (
          <>
            <Input label="Subjects (comma separated)" value={subjects} onChange={e => setSubjects(e.target.value)} required />
            <Input label="Grades (comma separated)" value={grades} onChange={e => setGrades(e.target.value)} required />
          </>
        )}
        <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {userId && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-300 text-center">
          <div className="font-bold">Registration Successful!</div>
          <div>Your Login ID: <span className="font-mono text-lg">{userId}</span></div>
          <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">Please save this ID. You will use it to log in.</div>
        </div>
      )}
    </div>
  );
}

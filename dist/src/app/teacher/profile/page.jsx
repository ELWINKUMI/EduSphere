"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { LogOut, Save, User, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
export default function TeacherProfilePage() {
    var _this = this;
    var _a = useAuth(), user = _a.user, loading = _a.loading, logout = _a.logout, refreshUser = _a.refreshUser;
    var router = useRouter();
    var _b = useState({
        name: "",
        email: "",
    }), form = _b[0], setForm = _b[1];
    // For future: add password fields if needed
    var _c = useState(false), editMode = _c[0], setEditMode = _c[1];
    var _d = useState(false), saving = _d[0], setSaving = _d[1];
    var _e = useState([]), classes = _e[0], setClasses = _e[1];
    var _f = useState(false), classesLoading = _f[0], setClassesLoading = _f[1];
    useEffect(function () {
        var fetchClasses = function () { return __awaiter(_this, void 0, void 0, function () {
            var token, res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setClassesLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        token = localStorage.getItem("token");
                        return [4 /*yield*/, fetch("/api/teacher/classes", {
                                headers: { Authorization: "Bearer ".concat(token) },
                            })];
                    case 2:
                        res = _b.sent();
                        if (!res.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _b.sent();
                        setClasses(data.classes || []);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        setClassesLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        if (user && user.role === "teacher") {
            fetchClasses();
        }
    }, [user]);
    useEffect(function () {
        if (!loading && (!user || user.role !== "teacher")) {
            router.push("/auth/login");
        }
        else if (user) {
            setForm({ name: user.name || "", email: user.email || "" });
        }
    }, [user, loading, router]);
    var handleChange = function (e) {
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.value, _a)));
        });
    };
    var handleSave = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!form.name || !form.email) {
                        toast.error("Name and email are required.");
                        return [2 /*return*/];
                    }
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    token = localStorage.getItem("token");
                    return [4 /*yield*/, fetch("/api/teacher/profile", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(token),
                            },
                            body: JSON.stringify({
                                name: form.name,
                                email: form.email,
                            }),
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    toast.success("Profile updated successfully.");
                    setEditMode(false);
                    return [4 /*yield*/, refreshUser()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = _a.sent();
                    toast.error(data.message || "Failed to update profile.");
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    err_1 = _a.sent();
                    toast.error("An error occurred. Please try again.");
                    return [3 /*break*/, 9];
                case 8:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600"/>
      </div>);
    }
    if (!user || user.role !== "teacher") {
        return null;
    }
    var _g = useState(false), resetting = _g[0], setResetting = _g[1];
    var handleResetStats = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, res, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to reset all your records and stats for the new term? This cannot be undone.'))
                        return [2 /*return*/];
                    setResetting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/reset-stats', {
                            method: 'POST',
                            headers: { Authorization: "Bearer ".concat(token) },
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    toast.success('Your records and stats have been reset.');
                    // Optionally refresh page or user data
                    setClasses([]);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = _b.sent();
                    toast.error(data.error || 'Failed to reset records.');
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    _a = _b.sent();
                    toast.error('Failed to reset records.');
                    return [3 /*break*/, 7];
                case 7:
                    setResetting(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-10 px-4 transition-colors">
      <div className="w-full max-w-xl bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col gap-6 transition-colors">
        {/* Back button */}
        <button type="button" className="mb-4 w-fit flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" onClick={function () { return router.push('/teacher/dashboard'); }}>
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
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Teacher ID: <span className="font-mono text-gray-900 dark:text-white">{user.userId || user.id || 'N/A'}</span></span>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Class{Array.isArray(classes) && classes.length > 1 ? 'es' : ''}: <span className="font-mono text-gray-900 dark:text-white">{Array.isArray(classes) && classes.length > 0
            ? classes.map(function (cls) { return (cls.gradeLevel || cls.title || 'N/A'); }).join(', ')
            : 'N/A'}</span></span>
            </div>
          </div>
        </div>
        {/* Classes Taught */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2"/>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Classes You Teach</h3>
          </div>
          {classesLoading ? (<div className="text-gray-500 dark:text-gray-400 text-sm">Loading classes...</div>) : classes.length === 0 ? (<div className="text-gray-500 dark:text-gray-400 text-sm">You are not teaching any classes yet.</div>) : (<ul className="space-y-2">
              {classes.map(function (cls) { return (<li key={cls._id} className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">{cls.title}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{cls.subject} • {cls.gradeLevel} {cls.isActive === false && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}</div>
                </li>); })}
            </ul>)}
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="name">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300"/>
              <input type="text" id="name" name="name" className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" value={form.name} onChange={handleChange} disabled={!editMode} autoComplete="name"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-400 dark:text-blue-300"/>
              <input type="email" id="email" name="email" className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" value={form.email} onChange={handleChange} disabled={!editMode} autoComplete="email"/>
            </div>
          </div>
          {/* Teacher ID Display (already in header) */}
          <div className="flex gap-3 mt-2">
            <button type="button" className="py-2 px-4 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-colors flex items-center gap-2" onClick={handleResetStats} disabled={resetting}>
              {resetting ? <Loader2 className="animate-spin h-5 w-5"/> : <BookOpen className="h-5 w-5"/>} Reset My Records
            </button>
            {!editMode ? (<button type="button" className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors" onClick={function () { return setEditMode(true); }}>
                Edit Profile
              </button>) : (<>
                <button type="submit" className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5"/>} Save Changes
                </button>
                <button type="button" className="flex-1 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" onClick={function () { setEditMode(false); setForm({ name: user.name || "", email: user.email || "" }); }} disabled={saving}>
                  Cancel
                </button>
              </>)}
            <button type="button" className="py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center gap-2" onClick={logout}>
              <LogOut className="h-5 w-5"/> Logout
            </button>
          </div>
        </form>
      </div>
    </div>);
}

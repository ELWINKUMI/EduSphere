'use client';
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
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function CreateAnnouncementPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState([]), courses = _a[0], setCourses = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState({
        title: '',
        content: '',
        courseId: '',
        priority: 'normal',
        sendEmail: false,
        publishAt: ''
    }), formData = _c[0], setFormData = _c[1];
    useEffect(function () {
        if (!user || user.role !== 'teacher') {
            router.push('/auth/login');
            return;
        }
        fetchCourses();
        // Pre-select course if courseId is provided in URL
        var urlParams = new URLSearchParams(window.location.search);
        var courseId = urlParams.get('courseId');
        if (courseId) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { courseId: courseId })); });
        }
    }, [user, router]);
    var fetchCourses = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/subjects', {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setCourses(data.subjects || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching courses:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.title || !formData.content || !formData.courseId) {
                        toast.error('Please fill in all required fields');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/announcements', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify(formData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Announcement created successfully!');
                    router.push('/teacher/dashboard');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to create announcement');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    toast.error('Error creating announcement');
                    return [3 /*break*/, 7];
                case 7:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teacher/dashboard" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Announcement</h1>
              <p className="text-gray-600 dark:text-gray-300">Share important information with your students</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Announcement Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input type="text" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Enter announcement title" required/>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course *
                </label>
                <select value={formData.courseId} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { courseId: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
                  <option value="">Select a course</option>
                  {courses.map(function (course) { return (<option key={course._id} value={course._id}>
                      {course.subject} - {course.gradeLevel} ({course.title})
                    </option>); })}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select value={formData.priority} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { priority: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea value={formData.content} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { content: e.target.value })); }} rows={8} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Enter announcement content..." required/>
            </div>

            {/* Options */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="sendEmail" checked={formData.sendEmail} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { sendEmail: e.target.checked })); }} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Send email notification to students
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Publish At (Optional)
                </label>
                <input type="datetime-local" value={formData.publishAt} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { publishAt: e.target.value })); }} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"/>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to publish immediately
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/teacher/dashboard" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
              {loading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>) : (<>
                  <Send className="h-4 w-4 mr-2"/>
                  Create Announcement
                </>)}
            </button>
          </div>
        </form>
      </div>
    </div>);
}

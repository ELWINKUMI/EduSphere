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
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function ResourcesManagementPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState([]), courses = _a[0], setCourses = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState({
        title: '',
        description: '',
        courseId: '',
        type: 'document'
    }), formData = _c[0], setFormData = _c[1];
    var _d = useState(null), selectedFile = _d[0], setSelectedFile = _d[1];
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
    var handleFileChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setSelectedFile(file);
            if (!formData.title) {
                setFormData(function (prev) { return (__assign(__assign({}, prev), { title: file.name })); });
            }
        }
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var formDataToSend, token, response, fileInput, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.title || !formData.courseId || !selectedFile) {
                        toast.error('Please fill in all required fields and select a file');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    formDataToSend = new FormData();
                    formDataToSend.append('title', formData.title);
                    formDataToSend.append('description', formData.description);
                    formDataToSend.append('courseId', formData.courseId);
                    formDataToSend.append('type', formData.type);
                    formDataToSend.append('file', selectedFile);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/resources', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: formDataToSend
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Resource uploaded successfully!');
                    setFormData({ title: '', description: '', courseId: '', type: 'document' });
                    setSelectedFile(null);
                    fileInput = document.getElementById('file-upload');
                    if (fileInput)
                        fileInput.value = '';
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to upload resource');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    toast.error('Error uploading resource');
                    return [3 /*break*/, 7];
                case 7:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teacher/dashboard" className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-4">
              <Upload className="h-8 w-8 text-green-600 dark:text-green-400"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Resource</h1>
              <p className="text-gray-600 dark:text-gray-300">Share learning materials with your students</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Resource Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input type="text" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Enter resource title" required/>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course *
                </label>
                <select value={formData.courseId} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { courseId: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
                  <option value="">Select a course</option>
                  {courses.map(function (course) { return (<option key={course._id} value={course._id}>
                      {course.subject} - {course.gradeLevel} ({course.title})
                    </option>); })}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Type
                </label>
                <select value={formData.type} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { type: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File *
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required/>
                {selectedFile && (<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>)}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }} rows={4} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Enter resource description (optional)"/>
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
                  Uploading...
                </>) : (<>
                  <Upload className="h-4 w-4 mr-2"/>
                  Upload Resource
                </>)}
            </button>
          </div>
        </form>
      </div>
    </div>);
}

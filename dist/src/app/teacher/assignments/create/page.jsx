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
import { ArrowLeft, FileText, Calendar, Upload } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
export default function CreateAssignmentPage() {
    var _this = this;
    useAuth();
    var router = useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState([]), courses = _b[0], setCourses = _b[1];
    var _c = useState(true), coursesLoading = _c[0], setCoursesLoading = _c[1];
    var _d = useState([]), attachments = _d[0], setAttachments = _d[1];
    var _e = useState({
        title: '',
        description: '',
        courseId: '',
        dueDate: '',
        maxPoints: '',
        submissionType: 'file',
        instructions: ''
    }), formData = _e[0], setFormData = _e[1];
    // Load teacher's courses
    useEffect(function () {
        var fetchCourses = function () { return __awaiter(_this, void 0, void 0, function () {
            var token, response, data, errorData, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, 7, 8]);
                        token = localStorage.getItem('token');
                        if (!token) {
                            toast.error('Authentication required');
                            return [2 /*return*/];
                        }
                        console.log('Fetching courses...');
                        return [4 /*yield*/, fetch('/api/courses', {
                                headers: {
                                    'Authorization': "Bearer ".concat(token)
                                }
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        console.log('Courses API response:', data);
                        console.log('Raw courses data:', JSON.stringify(data.courses, null, 2));
                        // Check if courses array exists and has content
                        if (!data.courses || !Array.isArray(data.courses)) {
                            console.error('Courses API returned invalid data structure:', data);
                            toast.error('Invalid courses data received');
                            return [2 /*return*/];
                        }
                        if (data.courses.length === 0) {
                            console.warn('No courses found for teacher');
                            toast('No courses found. Please create a course first.');
                        }
                        setCourses(data.courses || []);
                        // Validate that courses have proper id fields (changed from _id to id)
                        (_a = data.courses) === null || _a === void 0 ? void 0 : _a.forEach(function (course, index) {
                            console.log("Course ".concat(index, ":"), course);
                            if (!course.id || typeof course.id !== 'string') {
                                console.error('Invalid course object:', course);
                            }
                        });
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        errorData = _b.sent();
                        console.error('Failed to fetch courses:', errorData);
                        toast.error('Failed to load courses');
                        _b.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _b.sent();
                        console.error('Error fetching courses:', error_1);
                        toast.error('Error loading courses');
                        return [3 /*break*/, 8];
                    case 7:
                        setCoursesLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchCourses();
    }, []);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        console.log("Field changed: ".concat(name, " = ").concat(value));
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleFileChange = function (e) {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, form_1, response, responseData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    // Validation
                    if (!formData.title || !formData.description || !formData.courseId || !formData.dueDate) {
                        toast.error('Please fill in all required fields');
                        return [2 /*return*/];
                    }
                    // Validate courseId format (24 characters for MongoDB ObjectId)
                    if (formData.courseId.length !== 24) {
                        toast.error('Invalid course selection. Please select a valid course.');
                        console.error('Invalid courseId length:', formData.courseId);
                        return [2 /*return*/];
                    }
                    // Debug information
                    console.log('=== SUBMISSION DEBUG INFO ===');
                    console.log('Form data:', formData);
                    console.log('Selected course:', courses.find(function (c) { return c.id === formData.courseId; })); // Changed from _id to id
                    console.log('All courses:', courses);
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    token = localStorage.getItem('token');
                    if (!token) {
                        toast.error('Authentication required');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    form_1 = new FormData();
                    form_1.append('title', formData.title);
                    form_1.append('description', formData.description);
                    form_1.append('course', formData.courseId); // Make sure this is the ObjectId
                    form_1.append('dueDate', formData.dueDate);
                    form_1.append('maxPoints', formData.maxPoints || '100');
                    form_1.append('submissionType', formData.submissionType);
                    // Add instructions if provided
                    if (formData.instructions) {
                        form_1.append('instructions', formData.instructions);
                    }
                    // Append files
                    attachments.forEach(function (file) {
                        form_1.append('attachments', file);
                    });
                    // Debug FormData contents
                    console.log('FormData being sent:');
                    Array.from(form_1.entries()).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        console.log("".concat(key, ": ").concat(value));
                    });
                    return [4 /*yield*/, fetch('/api/assignments', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: form_1
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    responseData = _a.sent();
                    console.log('API Response:', responseData);
                    if (response.ok) {
                        toast.success('Assignment created successfully!');
                        router.push('/teacher/dashboard');
                    }
                    else {
                        toast.error(responseData.error || 'Failed to create assignment');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Submit error:', error_2);
                    toast.error('An error occurred. Please try again.');
                    return [3 /*break*/, 5];
                case 5:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Get tomorrow's date as minimum due date
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var minDate = tomorrow.toISOString().split('T')[0];
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <div className="bg-green-600 p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-white"/>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
                  <p className="text-gray-600">Create an assignment for your students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Assignment Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Chapter 5 Review Questions" required/>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  {coursesLoading ? (<div className="w-full px-4 py-3 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Loading courses...
                    </div>) : (<select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                      <option value="">Select a course</option>
                      {courses.map(function (course) { return (<option key={course.id} value={course.id}> {/* Changed from _id to id */}
                          {course.title} - {course.subject} (Grade {course.gradeLevel})
                        </option>); })}
                    </select>)}
                  {courses.length === 0 && !coursesLoading && (<p className="text-sm text-red-600 mt-1">
                      No courses available. Please create a course first.
                    </p>)}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <div className="relative">
                    <input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleChange} min={minDate} className="w-full px-4 py-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required/>
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  </div>
                </div>
                
                <Input label="Max Points" name="maxPoints" type="number" value={formData.maxPoints} onChange={handleChange} placeholder="100" min="1" max="1000"/>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea label="Assignment Description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a clear description of what students need to do..." rows={4} required/>
            </div>

            {/* Submission Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select name="submissionType" value={formData.submissionType} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="file">File Upload</option>
                <option value="text">Text Submission</option>
                <option value="both">File Upload + Text</option>
              </select>
            </div>

            {/* Instructions */}
            <div>
              <Textarea label="Additional Instructions" name="instructions" value={formData.instructions} onChange={handleChange} placeholder="Any additional instructions, formatting requirements, etc..." rows={3}/>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Files (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
                <div className="space-y-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-green-600 hover:text-green-500 font-medium">
                      Click to upload files
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"/>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB each
                  </p>
                </div>
              </div>
              {attachments.length > 0 && (<div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                  <ul className="space-y-1">
                    {attachments.map(function (file, index) { return (<li key={index} className="text-sm text-gray-600 flex items-center">
                        <FileText className="h-4 w-4 mr-2"/>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>); })}
                  </ul>
                </div>)}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/teacher/dashboard" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={loading || courses.length === 0} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>);
}

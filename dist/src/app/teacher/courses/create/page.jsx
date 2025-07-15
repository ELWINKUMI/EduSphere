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
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { ALL_GRADES, getSubjectsForGrade } from '@/lib/schoolConfig';
export default function CreateCoursePage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState({
        title: '',
        description: '',
        subject: '',
        gradeLevel: '',
        maxStudents: '30',
        enrollmentCode: ''
    }), formData = _b[0], setFormData = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    // Get available subjects for the selected grade level
    var availableSubjects = formData.gradeLevel ? getSubjectsForGrade(formData.gradeLevel) : [];
    var generateEnrollmentCode = function () {
        var code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData(function (prev) { return (__assign(__assign({}, prev), { enrollmentCode: code })); });
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.title || !formData.description || !formData.subject || !formData.gradeLevel) {
                        toast.error('Please fill in all required fields');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    token = localStorage.getItem('token');
                    if (!token) {
                        toast.error('Authentication required');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch('/api/courses', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({
                                title: formData.title,
                                description: formData.description,
                                subject: formData.subject,
                                gradeLevel: formData.gradeLevel,
                                maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : 30,
                                enrollmentCode: formData.enrollmentCode
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        toast.success('Course created successfully!');
                        router.push('/teacher/dashboard');
                    }
                    else {
                        toast.error(data.error || 'Failed to create course');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error creating course:', error_1);
                    toast.error('An error occurred. Please try again.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
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
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white"/>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                  <p className="text-gray-600">Set up a new course for your students</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Course Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Mathematics 101" required/>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level *
                  </label>
                  <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                    <option value="">Select grade level</option>
                    {ALL_GRADES.map(function (grade) { return (<option key={grade} value={grade}>
                        {grade}
                      </option>); })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required disabled={!formData.gradeLevel}>
                    <option value="">
                      {formData.gradeLevel ? 'Select subject' : 'First select grade level'}
                    </option>
                    {availableSubjects.map(function (subject) { return (<option key={subject} value={subject}>
                        {subject}
                      </option>); })}
                  </select>
                </div>
                
                <Input label="Max Students" name="maxStudents" type="number" value={formData.maxStudents} onChange={handleChange} placeholder="e.g., 30" min="1" max="100"/>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea label="Course Description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed description of the course content, objectives, and expectations..." rows={4} required/>
            </div>

            {/* Enrollment Code */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Enrollment</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input label="Enrollment Code" name="enrollmentCode" value={formData.enrollmentCode} onChange={handleChange} placeholder="Auto-generated or custom code"/>
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={generateEnrollmentCode} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Generate Code
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Students will use this code to enroll in your course. Leave empty to auto-generate.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/teacher/dashboard" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>);
}

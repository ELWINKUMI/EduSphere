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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap, Users, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { ALL_GRADES, getSubjectsForGrade, getSchoolLevel } from '@/lib/schoolConfig';
export default function CreateSubjectPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState([]), selectedGrades = _b[0], setSelectedGrades = _b[1];
    var _c = useState({
        title: '',
        description: '',
        subject: '',
        gradeLevel: '',
        maxStudents: '30',
        enrollmentCode: '',
        objectives: '',
        prerequisites: '',
        duration: '1', // Semester/Year
        schedule: ''
    }), formData = _c[0], setFormData = _c[1];
    // Auto-generate enrollment code when title changes
    useEffect(function () {
        if (formData.title && formData.gradeLevel) {
            var code_1 = "".concat(formData.subject.slice(0, 3).toUpperCase()).concat(formData.gradeLevel.replace(/\s/g, '')).concat(Math.random().toString(36).substring(2, 5).toUpperCase());
            setFormData(function (prev) { return (__assign(__assign({}, prev), { enrollmentCode: code_1 })); });
        }
    }, [formData.title, formData.gradeLevel, formData.subject]);
    // Get available subjects for the selected grade level
    var availableSubjects = formData.gradeLevel ? getSubjectsForGrade(formData.gradeLevel) : [];
    // Get school level for styling
    var schoolLevel = formData.gradeLevel ? getSchoolLevel(formData.gradeLevel) : null;
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var generateEnrollmentCode = function () {
        var code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData(function (prev) { return (__assign(__assign({}, prev), { enrollmentCode: code })); });
    };
    var handleGradeSelection = function (grade) {
        setSelectedGrades(function (prev) {
            if (prev.includes(grade)) {
                return prev.filter(function (g) { return g !== grade; });
            }
            else {
                return __spreadArray(__spreadArray([], prev, true), [grade], false);
            }
        });
        // Set the primary grade for subject selection
        if (!selectedGrades.includes(grade)) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { gradeLevel: grade, subject: '' // Reset subject when grade changes
             })); });
        }
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
                                enrollmentCode: formData.enrollmentCode,
                                objectives: formData.objectives,
                                prerequisites: formData.prerequisites,
                                duration: formData.duration,
                                schedule: formData.schedule
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        toast.success('Subject created successfully!');
                        router.push('/teacher/dashboard');
                    }
                    else {
                        toast.error(data.error || 'Failed to create subject');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error creating subject:', error_1);
                    toast.error('An error occurred. Please try again.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var getSchoolLevelColor = function (level) {
        switch (level) {
            case 'PRIMARY': return 'from-green-400 to-blue-500';
            case 'JHS': return 'from-blue-400 to-purple-500';
            case 'SHS': return 'from-purple-400 to-pink-500';
            default: return 'from-gray-400 to-gray-600';
        }
    };
    var getSchoolLevelIcon = function (level) {
        switch (level) {
            case 'PRIMARY': return '🎨';
            case 'JHS': return '📚';
            case 'SHS': return '🎓';
            default: return '📖';
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/teacher/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600"/>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Subject
                </h1>
                <p className="text-gray-600">Set up a new subject for your students</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4"/>
              <span>Estimated time: 5-10 minutes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <span className="text-sm font-medium text-blue-600">Basic Information</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <span className="text-sm text-gray-400">Configuration</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <span className="text-sm text-gray-400">Review & Create</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2"/>
                    Basic Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Subject Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Advanced Mathematics" required className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"/>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level *
                      </label>
                      <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required>
                        <option value="">Select grade level</option>
                        {ALL_GRADES.map(function (grade) { return (<option key={grade} value={grade}>
                            {grade}
                          </option>); })}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Area *
                    </label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required disabled={!formData.gradeLevel}>
                      <option value="">
                        {formData.gradeLevel ? 'Select subject area' : 'First select grade level'}
                      </option>
                      {availableSubjects.map(function (subject) { return (<option key={subject} value={subject}>
                          {subject}
                        </option>); })}
                    </select>
                  </div>

                  <Textarea label="Subject Description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a comprehensive description of what students will learn in this subject..." rows={4} required className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>

              {/* Advanced Configuration Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Target className="h-5 w-5 mr-2"/>
                    Learning Configuration
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Maximum Students" name="maxStudents" type="number" value={formData.maxStudents} onChange={handleChange} placeholder="30" min="1" max="100" className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"/>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                        <option value="1">1 Semester</option>
                        <option value="2">2 Semesters (Full Year)</option>
                        <option value="0.5">Half Semester</option>
                      </select>
                    </div>
                  </div>

                  <Textarea label="Learning Objectives" name="objectives" value={formData.objectives} onChange={handleChange} placeholder="What will students achieve by the end of this subject? List key learning outcomes..." rows={3} className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"/>

                  <Textarea label="Prerequisites" name="prerequisites" value={formData.prerequisites} onChange={handleChange} placeholder="What should students know before taking this subject? (Optional)" rows={2} className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"/>

                  <Input label="Schedule Information" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM" className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"/>
                </div>
              </div>

              {/* Enrollment Configuration Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="h-5 w-5 mr-2"/>
                    Enrollment Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input label="Enrollment Code" name="enrollmentCode" value={formData.enrollmentCode} onChange={handleChange} placeholder="AUTO-GENERATED" className="transition-all duration-200 focus:ring-2 focus:ring-green-500"/>
                    </div>
                    <button type="button" onClick={generateEnrollmentCode} className="mt-7 px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium">
                      Generate New
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Students will use this code to enroll in your subject
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/teacher/dashboard" className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </Link>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg">
                  {loading ? (<span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>) : ('Create Subject')}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {formData.gradeLevel && (<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className={"bg-gradient-to-r ".concat(getSchoolLevelColor(schoolLevel), " px-6 py-4")}>
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="text-2xl mr-2">{getSchoolLevelIcon(schoolLevel)}</span>
                    Preview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{formData.title || 'Subject Title'}</h4>
                      <p className="text-sm text-gray-600">{formData.subject} • {formData.gradeLevel}</p>
                    </div>
                    
                    {formData.description && (<p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>)}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Max Students: {formData.maxStudents}</span>
                      <span>Code: {formData.enrollmentCode}</span>
                    </div>
                  </div>
                </div>
              </div>)}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg border border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Choose clear, descriptive titles that students can easily understand
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Include specific learning outcomes in your objectives
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Keep enrollment codes simple but unique
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You can always edit these details later
                </li>
              </ul>
            </div>

            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600"/>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Subjects:</span>
                  <span className="font-medium">{availableSubjects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">School Level:</span>
                  <span className="font-medium">{schoolLevel || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration} Semester(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);
}

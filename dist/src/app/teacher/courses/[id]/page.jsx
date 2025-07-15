'use client';
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
import { useRouter, useParams } from 'next/navigation';
import { BookOpen, ArrowLeft, Users, FileText, Play, BarChart3, Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function TeacherCourseDetailPage() {
    var _this = this;
    var _a;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    var courseId = params.id;
    var _b = useState(null), subject = _b[0], setSubject = _b[1];
    var _c = useState([]), assignments = _c[0], setAssignments = _c[1];
    var _d = useState([]), quizzes = _d[0], setQuizzes = _d[1];
    var _e = useState([]), students = _e[0], setStudents = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState('overview'), activeTab = _g[0], setActiveTab = _g[1];
    useEffect(function () {
        if (user && user.role === 'teacher') {
            fetchSubjectDetails();
        }
        else if (user && user.role !== 'teacher') {
            router.push("/".concat(user.role, "/dashboard"));
        }
    }, [user, router, courseId]);
    var fetchSubjectDetails = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/auth/login');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId), {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setSubject(data.course);
                    // Fetch related data
                    return [4 /*yield*/, Promise.all([
                            fetchAssignments(),
                            fetchQuizzes(),
                            fetchStudents()
                        ])];
                case 3:
                    // Fetch related data
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    if (response.status === 404) {
                        toast.error('Subject not found');
                        router.push('/teacher/dashboard');
                    }
                    else {
                        toast.error('Failed to load subject details');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error fetching subject details:', error_1);
                    toast.error('Error loading subject details');
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var fetchAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/assignments"), {
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
                    setAssignments(data.assignments || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching assignments:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchQuizzes = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/teacher/courses/".concat(courseId, "/quizzes"), {
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
                    setQuizzes(data.quizzes || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error fetching quizzes:', error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchStudents = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/courses/".concat(courseId, "/students"), {
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
                    setStudents(data.students || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error fetching students:', error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var deleteAssignment = function (assignmentId) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this assignment?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/assignments/".concat(assignmentId), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast.success('Assignment deleted successfully');
                        fetchAssignments();
                    }
                    else {
                        toast.error('Failed to delete assignment');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error deleting assignment:', error_5);
                    toast.error('Error deleting assignment');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var deleteQuiz = function (quizId) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this quiz?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/quizzes/".concat(quizId), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast.success('Quiz deleted successfully');
                        fetchQuizzes();
                    }
                    else {
                        toast.error('Failed to delete quiz');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('Error deleting quiz:', error_6);
                    toast.error('Error deleting quiz');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>);
    }
    if (!subject) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Subject Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The subject you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/teacher/dashboard" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Dashboard
          </Link>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subject.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {subject.subject} • Grade {subject.gradeLevel}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">
                {((_a = subject.students) === null || _a === void 0 ? void 0 : _a.length) || 0} / {subject.maxStudents} students
              </span>
                <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full font-mono">
                  {subject.enrollmentCode}
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'quizzes', label: 'Quizzes', icon: Play },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(function (_a) {
            var id = _a.id, label = _a.label, Icon = _a.icon;
            return (<button key={id} onClick={function () { return setActiveTab(id); }} className={"flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ".concat(activeTab === id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white')}>
              <Icon className="h-4 w-4 mr-2"/>
              {label}
            </button>);
        })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About This Subject</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {subject.description || 'No description provided for this subject.'}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                    <p className="text-gray-600 dark:text-gray-400">{subject.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Grade Level:</span>
                    <p className="text-gray-600 dark:text-gray-400">Grade {subject.gradeLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Enrollment Code:</span>
                    <p className="text-gray-600 dark:text-gray-400 font-mono">{subject.enrollmentCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Students</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{quizzes.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/teacher/assignments/create" className="flex items-center w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
                    <Plus className="h-4 w-4 mr-3"/>
                    Create Assignment
                  </Link>
                  <Link href="/teacher/quizzes/create" className="flex items-center w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                    <Plus className="h-4 w-4 mr-3"/>
                    Create Quiz
                  </Link>
                </div>
              </div>
            </div>
          </div>)}

        {activeTab === 'assignments' && (<div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Assignments</h3>
              <Link href={"/teacher/assignments/create?courseId=".concat(courseId)} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4 mr-2"/>
                Create Assignment
              </Link>
            </div>

            {assignments.length === 0 ? (<div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No assignments yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first assignment to get started.
                </p>
                <Link href={"/teacher/assignments/create?courseId=".concat(courseId)} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2"/>
                  Create Assignment
                </Link>
              </div>) : (<div className="grid gap-6">
                {assignments.map(function (assignment) { return (<div key={assignment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {assignment.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {assignment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1"/>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span>{assignment.maxPoints} points</span>
                          <span>{assignment.submissionCount} submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={"/teacher/assignments/".concat(assignment._id, "/analytics")} className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="View Analytics">
                          <BarChart3 className="h-4 w-4"/>
                        </Link>
                        <Link href={"/teacher/assignments/".concat(assignment._id, "/edit")} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Assignment">
                          <Edit className="h-4 w-4"/>
                        </Link>
                        <button onClick={function () { return deleteAssignment(assignment._id); }} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Assignment">
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    </div>
                  </div>); })}
              </div>)}
          </div>)}

        {activeTab === 'quizzes' && (<div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Quizzes</h3>
              <Link href="/teacher/quizzes/create" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4 mr-2"/>
                Create Quiz
              </Link>
            </div>

            {quizzes.length === 0 ? (<div className="text-center py-12">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first quiz to get started.
                </p>
                <Link href="/teacher/quizzes/create" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2"/>
                  Create Quiz
                </Link>
              </div>) : (<div className="grid gap-6">
                {quizzes.map(function (quiz) { return (<div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {quiz.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {quiz.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1"/>
                            {quiz.timeLimit} minutes
                          </span>
                          <span>{quiz.totalQuestions} questions</span>
                          <span>{quiz.submissionCount} submissions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={"/teacher/quizzes/".concat(quiz._id, "/analytics")} className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="View Analytics">
                          <BarChart3 className="h-4 w-4"/>
                        </Link>
                        <Link href={"/teacher/quizzes/".concat(quiz._id, "/edit")} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Quiz">
                          <Edit className="h-4 w-4"/>
                        </Link>
                        <button onClick={function () { return deleteQuiz(quiz._id); }} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Quiz">
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    </div>
                  </div>); })}
              </div>)}
          </div>)}

        {activeTab === 'students' && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Students</h3>
            </div>
            <div className="p-6">
              {students.length === 0 ? (<div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students enrolled</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Students will appear here when they enroll using the course code: <span className="font-mono font-medium">{subject.enrollmentCode}</span>
                  </p>
                </div>) : (<div className="grid gap-4">
                  {students.map(function (student) { return (<div key={student._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={"/teacher/students/".concat(student._id, "/grades")} className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
                          View Grades
                        </Link>
                      </div>
                    </div>); })}
                </div>)}
            </div>
          </div>)}

        {activeTab === 'analytics' && (<div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {students.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {assignments.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assignments</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {quizzes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.round((subject.students.length / subject.maxStudents) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Enrollment</div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4"/>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Detailed Analytics</h4>
                <p className="mb-4">View detailed analytics for individual assignments and quizzes.</p>
                <div className="space-x-4">
                  <button onClick={function () { return setActiveTab('assignments'); }} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    View Assignment Analytics
                  </button>
                  <button onClick={function () { return setActiveTab('quizzes'); }} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Quiz Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}

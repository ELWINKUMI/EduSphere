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
import { FileText, Download, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function TeacherSubmissionsPage() {
    var _this = this;
    var user = useAuth().user;
    var _a = useState([]), submissions = _a[0], setSubmissions = _a[1];
    var _b = useState([]), assignments = _b[0], setAssignments = _b[1];
    var _c = useState(''), selectedAssignment = _c[0], setSelectedAssignment = _c[1];
    var _d = useState(true), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), grading = _e[0], setGrading = _e[1];
    var _f = useState({}), gradeForm = _f[0], setGradeForm = _f[1];
    useEffect(function () {
        fetchAssignments();
        fetchSubmissions();
    }, []);
    useEffect(function () {
        if (selectedAssignment) {
            fetchSubmissions(selectedAssignment);
        }
    }, [selectedAssignment]);
    var fetchAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem('token');
                    if (!token)
                        return [2 /*return*/];
                    return [4 /*yield*/, fetch('/api/assignments', {
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
                    setAssignments(data.assignments.map(function (assignment) { return (__assign(__assign({}, assignment), { submissionCount: 0 // Will be updated when we fetch submissions
                     })); }));
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching assignments:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchSubmissions = function (assignmentId) { return __awaiter(_this, void 0, void 0, function () {
        var token, url, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    token = localStorage.getItem('token');
                    if (!token)
                        return [2 /*return*/];
                    url = assignmentId
                        ? "/api/submissions?assignmentId=".concat(assignmentId)
                        : '/api/submissions';
                    return [4 /*yield*/, fetch(url, {
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
                    setSubmissions(data.submissions);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching submissions:', error_2);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleGradeChange = function (submissionId, field, value) {
        setGradeForm(function (prev) {
            var _a, _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[submissionId] = __assign(__assign({}, prev[submissionId]), (_b = {}, _b[field] = value, _b)), _a)));
        });
    };
    var submitGrade = function (submissionId) { return __awaiter(_this, void 0, void 0, function () {
        var formData, grade, submission, token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = gradeForm[submissionId];
                    if (!formData || !formData.grade) {
                        toast.error('Please enter a grade');
                        return [2 /*return*/];
                    }
                    grade = parseInt(formData.grade);
                    submission = submissions.find(function (s) { return s._id === submissionId; });
                    if (!submission)
                        return [2 /*return*/];
                    if (grade < 0 || grade > submission.assignment.maxPoints) {
                        toast.error("Grade must be between 0 and ".concat(submission.assignment.maxPoints));
                        return [2 /*return*/];
                    }
                    setGrading(submissionId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/submissions/".concat(submissionId, "/grade"), {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({
                                grade: grade,
                                feedback: formData.feedback || ''
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Grade submitted successfully!');
                    fetchSubmissions(selectedAssignment);
                    setGradeForm(function (prev) {
                        var updated = __assign({}, prev);
                        delete updated[submissionId];
                        return updated;
                    });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to submit grade');
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_3 = _a.sent();
                    console.error('Error submitting grade:', error_3);
                    toast.error('Failed to submit grade');
                    return [3 /*break*/, 8];
                case 7:
                    setGrading(null);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var getSubmissionStatus = function (submission) {
        var dueDate = new Date(submission.assignment.dueDate);
        var submittedDate = new Date(submission.submittedAt);
        if (submission.isGraded) {
            return { status: 'graded', color: 'green', icon: CheckCircle };
        }
        else if (submittedDate > dueDate) {
            return { status: 'late', color: 'yellow', icon: Clock };
        }
        else {
            return { status: 'on-time', color: 'blue', icon: FileText };
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
              <p className="text-gray-600">Review and grade student assignments</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/teacher/assignments/create" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Create Assignment
              </Link>
              <Link href="/teacher/dashboard" className="px-4 py-2 text-green-600 hover:text-green-700 font-medium">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Assignment:</label>
            <select value={selectedAssignment} onChange={function (e) { return setSelectedAssignment(e.target.value); }} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Assignments</option>
              {assignments.map(function (assignment) { return (<option key={assignment._id} value={assignment._id}>
                  {assignment.title} - {assignment.course.title}
                </option>); })}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {submissions.length === 0 ? (<div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedAssignment ? 'No submissions for the selected assignment.' : 'No submissions available.'}
            </p>
          </div>) : (<div className="space-y-6">
            {submissions.map(function (submission) {
                var statusInfo = getSubmissionStatus(submission);
                var StatusIcon = statusInfo.icon;
                var formData = gradeForm[submission._id] || { grade: '', feedback: '' };
                return (<div key={submission._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.assignment.title}
                          </h3>
                          <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-".concat(statusInfo.color, "-100 text-").concat(statusInfo.color, "-800")}>
                            <StatusIcon className="w-3 h-3 mr-1"/>
                            {statusInfo.status === 'graded' ? 'Graded' :
                        statusInfo.status === 'late' ? 'Late Submission' : 'On Time'}
                          </span>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <strong>Student:</strong> {submission.student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Due Date:</strong> {formatDate(submission.assignment.dueDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Max Points:</strong> {submission.assignment.maxPoints}
                          </p>
                        </div>

                        {/* Submission Files */}
                        {submission.files && submission.files.length > 0 && (<div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Files:</h4>
                            <div className="space-y-1">
                              {submission.files.map(function (filename, index) {
                            var displayName = filename.includes('/') ? filename.split('/').pop() : filename;
                            return (<button key={index} onClick={function () { return __awaiter(_this, void 0, void 0, function () {
                                    var token, cleanFilename, response, blob, url, link, error, error_4;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                token = localStorage.getItem('token');
                                                cleanFilename = filename.includes('/') ? filename.split('/').pop() : filename;
                                                if (!token || !cleanFilename) {
                                                    toast.error('Unable to download file');
                                                    return [2 /*return*/];
                                                }
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 7, , 8]);
                                                console.log('Teacher downloading submission file:', cleanFilename);
                                                return [4 /*yield*/, fetch("/api/submissions/download/".concat(encodeURIComponent(cleanFilename)), {
                                                        headers: {
                                                            'Authorization': "Bearer ".concat(token)
                                                        }
                                                    })];
                                            case 2:
                                                response = _a.sent();
                                                if (!response.ok) return [3 /*break*/, 4];
                                                return [4 /*yield*/, response.blob()];
                                            case 3:
                                                blob = _a.sent();
                                                url = window.URL.createObjectURL(blob);
                                                link = document.createElement('a');
                                                link.href = url;
                                                link.download = displayName || cleanFilename;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                window.URL.revokeObjectURL(url);
                                                return [3 /*break*/, 6];
                                            case 4: return [4 /*yield*/, response.text()];
                                            case 5:
                                                error = _a.sent();
                                                console.error('Download failed:', error);
                                                toast.error('Failed to download file');
                                                _a.label = 6;
                                            case 6: return [3 /*break*/, 8];
                                            case 7:
                                                error_4 = _a.sent();
                                                console.error('Download error:', error_4);
                                                toast.error('Error downloading file');
                                                return [3 /*break*/, 8];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); }} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mr-4 bg-transparent border-none cursor-pointer">
                                    <Download className="w-4 h-4 mr-1"/>
                                    Download {displayName || "File ".concat(index + 1)}
                                  </button>);
                        })}
                            </div>
                          </div>)}

                        {/* Existing Grade */}
                        {submission.isGraded && (<div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800 mb-2">Grade Information</h4>
                            <p className="text-sm text-green-700">
                              Grade: {submission.grade}/{submission.assignment.maxPoints}
                            </p>
                            {submission.feedback && (<p className="text-sm text-green-700 mt-1">
                                Feedback: {submission.feedback}
                              </p>)}
                          </div>)}
                      </div>
                    </div>

                    {/* Grading Section */}
                    {!submission.isGraded && (<div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Submission</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grade (0-{submission.assignment.maxPoints})
                            </label>
                            <input type="number" min="0" max={submission.assignment.maxPoints} value={formData.grade} onChange={function (e) { return handleGradeChange(submission._id, 'grade', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter grade"/>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback (Optional)
                            </label>
                            <textarea value={formData.feedback} onChange={function (e) { return handleGradeChange(submission._id, 'feedback', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Provide feedback to the student..." rows={2}/>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button onClick={function () { return submitGrade(submission._id); }} disabled={grading === submission._id || !formData.grade} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {grading === submission._id ? 'Submitting Grade...' : 'Submit Grade'}
                          </button>
                        </div>
                      </div>)}
                  </div>
                </div>);
            })}
          </div>)}
      </main>
    </div>);
}

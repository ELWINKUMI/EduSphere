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
import { Clock, FileText, Download, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function StudentAssignmentsPage() {
    var _this = this;
    var user = useAuth().user;
    var _a = useState([]), assignments = _a[0], setAssignments = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), submitting = _c[0], setSubmitting = _c[1];
    var _d = useState({}), selectedFiles = _d[0], setSelectedFiles = _d[1];
    useEffect(function () {
        fetchAssignments();
    }, []);
    var fetchAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
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
                    setAssignments(data.assignments);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching assignments:', error_1);
                    toast.error('Failed to load assignments');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleFileSelect = function (assignmentId, files) {
        if (files) {
            setSelectedFiles(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[assignmentId] = Array.from(files), _a)));
            });
        }
    };
    var uploadFiles = function (files) { return __awaiter(_this, void 0, void 0, function () {
        var uploadPromises;
        var _this = this;
        return __generator(this, function (_a) {
            uploadPromises = files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                var formData, response, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            formData = new FormData();
                            formData.append('file', file);
                            return [4 /*yield*/, fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new Error("Failed to upload ".concat(file.name));
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, data.url];
                    }
                });
            }); });
            return [2 /*return*/, Promise.all(uploadPromises)];
        });
    }); };
    var submitAssignment = function (assignmentId) { return __awaiter(_this, void 0, void 0, function () {
        var files, fileUrls, token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = selectedFiles[assignmentId] || [];
                    if (files.length === 0) {
                        toast.error('Please select at least one file to submit');
                        return [2 /*return*/];
                    }
                    setSubmitting(assignmentId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, uploadFiles(files)];
                case 2:
                    fileUrls = _a.sent();
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/submissions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({
                                assignmentId: assignmentId,
                                files: fileUrls
                            })
                        })];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    if (response.ok) {
                        toast.success('Assignment submitted successfully!');
                        fetchAssignments(); // Refresh assignments
                        setSelectedFiles(function (prev) {
                            var updated = __assign({}, prev);
                            delete updated[assignmentId];
                            return updated;
                        });
                    }
                    else {
                        toast.error(data.error || 'Failed to submit assignment');
                    }
                    return [3 /*break*/, 7];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error submitting assignment:', error_2);
                    toast.error('Failed to submit assignment');
                    return [3 /*break*/, 7];
                case 6:
                    setSubmitting(null);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var downloadFile = function (fileUrl, fileName) {
        var token = localStorage.getItem('token');
        // Extract filename from URL if it contains path separators
        var filename = fileUrl.includes('/') ? fileUrl.split('/').pop() : fileUrl;
        // Use the assignments download API
        var link = document.createElement('a');
        link.href = "/api/assignments/download/".concat(filename, "?token=").concat(token);
        if (fileName) {
            link.download = fileName;
        }
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var isOverdue = function (dueDate) {
        return new Date(dueDate) < new Date();
    };
    var getDaysUntilDue = function (dueDate) {
        var due = new Date(dueDate);
        var now = new Date();
        var diffTime = due.getTime() - now.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
              <p className="text-gray-600">View and submit your assignments</p>
            </div>
            <Link href="/student/dashboard" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {assignments.length === 0 ? (<div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
            <p className="mt-1 text-sm text-gray-500">No assignments available for your grade level.</p>
          </div>) : (<div className="space-y-6">
            {assignments.map(function (assignment) { return (<div key={assignment._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Link href={"/student/assignments/".concat(assignment._id)} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {assignment.title}
                        </Link>
                        {assignment.submitted ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Submitted
                          </span>) : isOverdue(assignment.dueDate) ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1"/>
                            Overdue
                          </span>) : getDaysUntilDue(assignment.dueDate) <= 1 ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1"/>
                            Due Soon
                          </span>) : null}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <strong>Course:</strong> {assignment.course.title} ({assignment.course.subject})
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Teacher:</strong> {assignment.teacher.name}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1"/>
                          <strong>Due:</strong> {formatDate(assignment.dueDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Points:</strong> {assignment.maxPoints}
                        </p>
                      </div>

                      <p className="mt-3 text-gray-700">{assignment.description}</p>

                      {/* Assignment Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (<div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignment Files:</h4>
                          <div className="space-y-2">
                            {assignment.attachments.filter(function (url) { return url && typeof url === 'string'; }).map(function (url, index) {
                        var fileName = (url === null || url === void 0 ? void 0 : url.split('/').pop()) || "Assignment File ".concat(index + 1);
                        return (<div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2"/>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{fileName}</span>
                                  </div>
                                  <button onClick={function () { return downloadFile(url, fileName); }} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                                    <Download className="w-3 h-3 mr-1"/>
                                    Download
                                  </button>
                                </div>);
                    })}
                          </div>
                        </div>)}

                      {/* Submission Status */}
                      {assignment.submitted && assignment.submissionData && (<div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 mb-2">Submission Details</h4>
                          <p className="text-sm text-green-700">
                            Submitted on: {formatDate(assignment.submissionData.submittedAt)}
                          </p>
                          {assignment.submissionData.grade !== undefined && (<p className="text-sm text-green-700">
                              Grade: {assignment.submissionData.grade}/{assignment.maxPoints}
                            </p>)}
                          {assignment.submissionData.feedback && (<p className="text-sm text-green-700 mt-1">
                              Feedback: {assignment.submissionData.feedback}
                            </p>)}
                        </div>)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <Link href={"/student/assignments/".concat(assignment._id)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText className="h-4 w-4 mr-2"/>
                      View Details & Submit
                    </Link>
                    
                    {assignment.submitted && (<span className="text-sm text-green-600 font-medium">
                        ✓ Assignment Submitted
                      </span>)}
                  </div>

                  {/* Legacy Submission Section - Keep for backward compatibility but encourage using detail page */}
                  {!assignment.submitted && !isOverdue(assignment.dueDate) && (<div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Click "View Details & Submit" above for a better submission experience with file downloads and detailed feedback.
                      </p>
                    </div>)}
                </div>
              </div>); })}
          </div>)}
      </main>
    </div>);
}

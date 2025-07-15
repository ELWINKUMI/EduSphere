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
import { ArrowLeft, Download, Upload, FileText, Clock, AlertCircle, CheckCircle, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function StudentAssignmentDetailPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    var assignmentId = params.id;
    var _a = useState(null), assignment = _a[0], setAssignment = _a[1];
    var _b = useState(null), submission = _b[0], setSubmission = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), submitting = _d[0], setSubmitting = _d[1];
    var _e = useState(''), submissionContent = _e[0], setSubmissionContent = _e[1];
    var _f = useState([]), selectedFiles = _f[0], setSelectedFiles = _f[1];
    useEffect(function () {
        if (assignmentId) {
            fetchAssignmentDetails();
        }
    }, [assignmentId]);
    var fetchAssignmentDetails = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/auth/login');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("/api/assignments/".concat(assignmentId), {
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
                    setAssignment(data.assignment);
                    setSubmission(data.submission || null);
                    if ((_a = data.submission) === null || _a === void 0 ? void 0 : _a.content) {
                        setSubmissionContent(data.submission.content);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    if (response.status === 404) {
                        toast.error('Assignment not found');
                        router.push('/student/assignments');
                    }
                    else {
                        toast.error('Failed to load assignment details');
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error fetching assignment details:', error_1);
                    toast.error('Error loading assignment details');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleFileSelection = function (event) {
        var files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };
    var handleSubmission = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, formData_1, response, data, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Validate based on submission type
                    if ((assignment === null || assignment === void 0 ? void 0 : assignment.submissionType) === 'text' && !submissionContent.trim()) {
                        toast.error('Please enter your submission content');
                        return [2 /*return*/];
                    }
                    if ((assignment === null || assignment === void 0 ? void 0 : assignment.submissionType) === 'file' && selectedFiles.length === 0) {
                        toast.error('Please select at least one file to submit');
                        return [2 /*return*/];
                    }
                    if ((assignment === null || assignment === void 0 ? void 0 : assignment.submissionType) === 'both' && !submissionContent.trim() && selectedFiles.length === 0) {
                        toast.error('Please provide either text content or upload files');
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    token = localStorage.getItem('token');
                    formData_1 = new FormData();
                    formData_1.append('content', submissionContent);
                    selectedFiles.forEach(function (file) {
                        formData_1.append('files', file);
                    });
                    return [4 /*yield*/, fetch("/api/assignments/".concat(assignmentId, "/submit"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: formData_1
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    setSubmission(data.submission);
                    setSelectedFiles([]);
                    setSubmissionContent('');
                    toast.success('Assignment submitted successfully!');
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to submit assignment');
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error submitting assignment:', error_2);
                    toast.error('Error submitting assignment');
                    return [3 /*break*/, 9];
                case 8:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var downloadFile = function (fileUrl, fileName, isSubmissionFile) {
        if (isSubmissionFile === void 0) { isSubmissionFile = false; }
        var token = localStorage.getItem('token');
        if (isSubmissionFile) {
            // For submission files, fileUrl is just the filename
            var link = document.createElement('a');
            link.href = "/api/submissions/download/".concat(fileUrl, "?token=").concat(token);
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else {
            // For assignment files, use the assignments download API
            var filename = fileUrl.split('/').pop();
            var link = document.createElement('a');
            link.href = "/api/assignments/download/".concat(filename, "?token=").concat(token);
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    var isOverdue = assignment && new Date() > new Date(assignment.dueDate);
    var canSubmit = assignment && !submission && !isOverdue;
    // Debug logging
    console.log('Assignment data:', {
        assignment: assignment ? {
            title: assignment.title,
            submissionType: assignment.submissionType,
            dueDate: assignment.dueDate,
            isActive: assignment.isActive
        } : null,
        submission: submission ? 'exists' : 'null',
        isOverdue: isOverdue,
        canSubmit: canSubmit
    });
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    if (!assignment) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The assignment you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/student/assignments" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Assignments
          </Link>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/student/assignments" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {assignment.course.title} • {assignment.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {submission ? (<span className="flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1"/>
                  Submitted
                </span>) : isOverdue ? (<span className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                  <AlertCircle className="h-4 w-4 mr-1"/>
                  Overdue
                </span>) : (<span className="flex items-center px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                  <Clock className="h-4 w-4 mr-1"/>
                  Pending
                </span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Start Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Due Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Max Points:</span>
                  <p className="text-gray-600 dark:text-gray-400">{assignment.maxPoints}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Subject:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {assignment.course.subject} • {assignment.course.gradeLevel}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignment Files */}
            {assignment.attachments && assignment.attachments.length > 0 && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Files</h3>
                <div className="space-y-3">
                  {assignment.attachments
                .filter(function (attachment) { return attachment && typeof attachment === 'string'; })
                .map(function (attachment, index) {
                var fileName = attachment.split('/').pop() || "File ".concat(index + 1);
                return (<div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500 mr-3"/>
                            <span className="text-gray-900 dark:text-white">{fileName}</span>
                          </div>
                        <button onClick={function () {
                        var filename = attachment.split('/').pop() || fileName;
                        downloadFile(filename, fileName, false);
                    }} className="flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                          <Download className="h-4 w-4 mr-1"/>
                          Download
                        </button>
                      </div>);
            })}
                </div>
              </div>)}

            {/* Submission Form */}
            {canSubmit && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Your Assignment</h3>
                
                {/* Submission Type Info */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Submission Type:</strong> {(assignment.submissionType || 'both') === 'both' ? 'Text and File submissions allowed' :
                (assignment.submissionType || 'both') === 'file' ? 'File submission only' :
                    'Text submission only'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {((assignment.submissionType || 'both') === 'text' || (assignment.submissionType || 'both') === 'both') && (<div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Submission Content {(assignment.submissionType || 'both') === 'text' ? '*' : ''}
                      </label>
                      <textarea value={submissionContent} onChange={function (e) { return setSubmissionContent(e.target.value); }} rows={6} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={(assignment.submissionType || 'both') === 'text' ? "Enter your assignment response here..." : "Optional: Add text content to your submission..."} required={(assignment.submissionType || 'both') === 'text'}/>
                    </div>)}

                  {((assignment.submissionType || 'both') === 'file' || (assignment.submissionType || 'both') === 'both') && (<div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Attach Files {(assignment.submissionType || 'both') === 'file' ? '*' : '(Optional)'}
                      </label>
                      <input type="file" multiple onChange={handleFileSelection} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required={(assignment.submissionType || 'both') === 'file'}/>
                      {selectedFiles.length > 0 && (<div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Selected files:</p>
                          <ul className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedFiles.map(function (file, index) { return (<li key={index}>• {file.name}</li>); })}
                          </ul>
                        </div>)}
                    </div>)}

                  <button onClick={handleSubmission} disabled={submitting || ((assignment.submissionType || 'both') === 'text' && !submissionContent.trim()) || ((assignment.submissionType || 'both') === 'file' && selectedFiles.length === 0) || ((assignment.submissionType || 'both') === 'both' && !submissionContent.trim() && selectedFiles.length === 0)} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {submitting ? (<>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>) : (<>
                        <Upload className="h-4 w-4 mr-2"/>
                        Submit Assignment
                      </>)}
                  </button>
                </div>
              </div>)}

            {/* Submission Details */}
            {submission && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Submission</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Submitted At:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Content:</span>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {submission.content}
                      </p>
                    </div>
                  </div>

                  {submission.files && submission.files.length > 0 && (<div>
                      <span className="font-medium text-gray-900 dark:text-white">Submitted Files:</span>
                      <div className="mt-2 space-y-2">
                        {submission.files
                    .filter(function (file) { return file && typeof file === 'string'; })
                    .map(function (file, index) {
                    // Handle both full paths and filenames
                    var fileName = file.includes('/') ? file.split('/').pop() || "File ".concat(index + 1) : file;
                    return (<div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-700 dark:text-gray-300">{fileName}</span>
                                <button onClick={function () { return downloadFile(fileName, fileName, true); }} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                  <Download className="h-4 w-4"/>
                                </button>
                              </div>);
                })}
                      </div>
                    </div>)}

                  {submission.isGraded && (<div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Grade:</span>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {submission.grade}/{assignment.maxPoints}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Graded At:</span>
                          <p className="text-gray-600 dark:text-gray-400">
                            {submission.gradedAt ? new Date(submission.gradedAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      {submission.feedback && (<div className="mt-4">
                          <span className="font-medium text-gray-900 dark:text-white">Teacher Feedback:</span>
                          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{submission.feedback}</p>
                          </div>
                        </div>)}
                    </div>)}
                </div>
              </div>)}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.course.subject} • {assignment.course.gradeLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{assignment.teacher.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={"/student/courses/".concat(assignment.course._id)} className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <BookOpen className="h-4 w-4 mr-2"/>
                  View Course
                </Link>
                <Link href="/student/assignments" className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <FileText className="h-4 w-4 mr-2"/>
                  All Assignments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

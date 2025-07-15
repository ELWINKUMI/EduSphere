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
import { Edit3, Trash2, Users, Copy, Eye, EyeOff, MoreVertical, BookOpen, Calendar, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
export default function SubjectManagement() {
    var _this = this;
    var router = useRouter();
    var _a = useState([]), subjects = _a[0], setSubjects = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), editingSubject = _c[0], setEditingSubject = _c[1];
    var _d = useState({
        title: '',
        description: '',
        maxStudents: 30,
        isActive: true
    }), editFormData = _d[0], setEditFormData = _d[1];
    var _e = useState(null), showDeleteModal = _e[0], setShowDeleteModal = _e[1];
    var _f = useState(null), actionMenuOpen = _f[0], setActionMenuOpen = _f[1];
    useEffect(function () {
        fetchSubjects();
    }, []);
    var fetchSubjects = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
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
                    setSubjects(data.subjects || []);
                    return [3 /*break*/, 4];
                case 3:
                    toast.error('Failed to load subjects');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching subjects:', error_1);
                    toast.error('Failed to load subjects');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (subject) {
        setEditingSubject(subject);
        setEditFormData({
            title: subject.title,
            description: subject.description,
            maxStudents: subject.maxStudents,
            isActive: subject.isActive
        });
        setActionMenuOpen(null);
    };
    var handleSaveEdit = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingSubject)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/teacher/subjects/".concat(editingSubject._id), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify(editFormData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Subject updated successfully');
                    setEditingSubject(null);
                    fetchSubjects(); // Refresh the list
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to update subject');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Error updating subject:', error_2);
                    toast.error('Failed to update subject');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (subject) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/teacher/subjects/".concat(subject._id), {
                            method: 'DELETE',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 2];
                    toast.success('Subject deleted successfully');
                    setShowDeleteModal(null);
                    fetchSubjects(); // Refresh the list
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to delete subject');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error deleting subject:', error_3);
                    toast.error('Failed to delete subject');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var copyEnrollmentCode = function (code) { return __awaiter(_this, void 0, void 0, function () {
        var err_1, textarea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(code)];
                case 1:
                    _a.sent();
                    toast.success('Enrollment code copied to clipboard!');
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    textarea = document.createElement('textarea');
                    textarea.value = code;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    toast.success('Enrollment code copied!');
                    return [3 /*break*/, 3];
                case 3:
                    setActionMenuOpen(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var getSubjectColor = function (subject) {
        var colors = {
            'Mathematics': 'from-blue-500 to-blue-600',
            'English Language': 'from-green-500 to-green-600',
            'Science': 'from-purple-500 to-purple-600',
            'Integrated Science': 'from-purple-500 to-purple-600',
            'Social Studies': 'from-orange-500 to-orange-600',
            'History': 'from-red-500 to-red-600',
            'Geography': 'from-teal-500 to-teal-600',
            'Physics': 'from-indigo-500 to-indigo-600',
            'Chemistry': 'from-pink-500 to-pink-600',
            'Biology': 'from-emerald-500 to-emerald-600',
        };
        return colors[subject] || 'from-gray-500 to-gray-600';
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    if (loading) {
        return (<div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Subjects</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(function (i) { return (<div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>); })}
        </div>
      </div>);
    }
    return (<div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Subjects</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
        </div>
      </div>

      {subjects.length === 0 ? (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-700"/>
          <p>No subjects created yet.</p>
          <p className="text-sm">Create your first subject to see it here.</p>
        </div>) : (<div className="space-y-4">
          {subjects.map(function (subject) { return (<div key={subject._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow bg-white dark:bg-gray-900">
              {/* Subject Header */}
              <div className={"bg-gradient-to-r ".concat(getSubjectColor(subject.subject), " p-4 text-white")}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{subject.title}</h4>
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <span>{subject.subject}</span>
                      <span>•</span>
                      <span>{subject.gradeLevel}</span>
                      <span>•</span>
                      <span>Created {formatDate(subject.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={"inline-flex items-center px-2 py-1 rounded-full text-xs ".concat(subject.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800')}>
                      {subject.isActive ? (<>
                          <Eye className="h-3 w-3 mr-1"/>
                          Active
                        </>) : (<>
                          <EyeOff className="h-3 w-3 mr-1"/>
                          Inactive
                        </>)}
                    </div>
                    <div className="relative">
                      <button onClick={function () { return setActionMenuOpen(actionMenuOpen === subject._id ? null : subject._id); }} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                        <MoreVertical className="h-4 w-4"/>
                      </button>
                      
                      {actionMenuOpen === subject._id && (<div className="absolute right-0 top-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 py-1 z-10 min-w-[150px] transition-colors duration-200">
                          <button onClick={function () {
                        setActionMenuOpen(null);
                        router.push("/teacher/courses/".concat(subject._id));
                    }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2"/>
                            View Course
                          </button>
                          <button onClick={function () { return handleEdit(subject); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                            <Edit3 className="h-4 w-4 mr-2"/>
                            Edit Subject
                          </button>
                          <button onClick={function () { return copyEnrollmentCode(subject.enrollmentCode); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                            <Copy className="h-4 w-4 mr-2"/>
                            Copy Code
                          </button>
                          <button onClick={function () { return setShowDeleteModal(subject); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Delete Subject
                          </button>
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Content */}
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{subject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Enrollment Code */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Enrollment Code</p>
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">{subject.enrollmentCode}</p>
                      </div>
                      <button onClick={function () { return copyEnrollmentCode(subject.enrollmentCode); }} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Copy code">
                        <Copy className="h-4 w-4"/>
                      </button>
                    </div>
                  </div>

                  {/* Students */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Students Enrolled</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2"/>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {subject.currentStudents}/{subject.maxStudents}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2"/>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDate(subject.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>); })}
        </div>)}

      {/* Edit Modal */}
      {editingSubject && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Edit Subject</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input type="text" value={editFormData.title} onChange={function (e) { return setEditFormData(function (prev) { return (__assign(__assign({}, prev), { title: e.target.value })); }); }} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea value={editFormData.description} onChange={function (e) { return setEditFormData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <input type="number" min="1" max="100" value={editFormData.maxStudents} onChange={function (e) { return setEditFormData(function (prev) { return (__assign(__assign({}, prev), { maxStudents: parseInt(e.target.value) || 30 })); }); }} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="isActive" checked={editFormData.isActive} onChange={function (e) { return setEditFormData(function (prev) { return (__assign(__assign({}, prev), { isActive: e.target.checked })); }); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Subject is active (students can enroll)
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button onClick={function () { return setEditingSubject(null); }} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Delete Subject</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{showDeleteModal.title}</strong>?
              </p>
              {showDeleteModal.currentStudents > 0 && (<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Warning:</strong> This subject has {showDeleteModal.currentStudents} enrolled students. 
                    You need to remove all students before deleting the subject.
                  </p>
                </div>)}
              <p className="text-red-600 text-sm mb-6">
                This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button onClick={function () { return setShowDeleteModal(null); }} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={function () { return handleDelete(showDeleteModal); }} disabled={showDeleteModal.currentStudents > 0} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  Delete Subject
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Click outside to close menus */}
      {actionMenuOpen && (<div className="fixed inset-0 z-10" onClick={function () { return setActionMenuOpen(null); }}/>)}
    </div>);
}

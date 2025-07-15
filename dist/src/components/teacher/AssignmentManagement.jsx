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
import { useTheme } from '@/components/providers/ThemeProvider';
import { BookOpen, Plus, Edit, Trash2, Calendar, Users, FileText, X, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';
export default function AssignmentManagement() {
    var _this = this;
    var user = useAuth().user;
    var isDark = useTheme().isDark;
    var _a = useState([]), assignments = _a[0], setAssignments = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), editingAssignment = _c[0], setEditingAssignment = _c[1];
    var _d = useState(false), showEditModal = _d[0], setShowEditModal = _d[1];
    var _e = useState({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
        submissionType: 'both',
        attachments: [],
        existingAttachments: []
    }), editData = _e[0], setEditData = _e[1];
    useEffect(function () {
        fetchAssignments();
    }, []);
    var fetchAssignments = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    token = localStorage.getItem('token');
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
                    return [3 /*break*/, 4];
                case 3:
                    toast.error('Failed to fetch assignments');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching assignments:', error_1);
                    toast.error('Error fetching assignments');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleEditAssignment = function (assignment) {
        setEditingAssignment(assignment);
        setEditData({
            title: assignment.title,
            description: assignment.description,
            dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
            maxPoints: assignment.maxPoints,
            submissionType: assignment.submissionType,
            attachments: [],
            existingAttachments: assignment.attachments
        });
        setShowEditModal(true);
    };
    var handleDeleteAssignment = function (assignmentId) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, error_2;
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
                    error_2 = _a.sent();
                    console.error('Error deleting assignment:', error_2);
                    toast.error('Error deleting assignment');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveEdit = function () { return __awaiter(_this, void 0, void 0, function () {
        var formData, token, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingAssignment)
                        return [2 /*return*/];
                    formData = new FormData();
                    formData.append('title', editData.title);
                    formData.append('description', editData.description);
                    formData.append('dueDate', editData.dueDate);
                    formData.append('maxPoints', editData.maxPoints.toString());
                    formData.append('submissionType', editData.submissionType);
                    formData.append('existingAttachments', JSON.stringify(editData.existingAttachments));
                    editData.attachments.forEach(function (file) {
                        formData.append('attachments', file);
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/assignments/".concat(editingAssignment._id), {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        toast.success('Assignment updated successfully');
                        setShowEditModal(false);
                        setEditingAssignment(null);
                        fetchAssignments();
                    }
                    else {
                        toast.error('Failed to update assignment');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error updating assignment:', error_3);
                    toast.error('Error updating assignment');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFileChange = function (e) {
        if (e.target.files) {
            setEditData(function (prev) { return (__assign(__assign({}, prev), { attachments: __spreadArray(__spreadArray([], prev.attachments, true), Array.from(e.target.files), true) })); });
        }
    };
    var removeNewFile = function (index) {
        setEditData(function (prev) { return (__assign(__assign({}, prev), { attachments: prev.attachments.filter(function (_, i) { return i !== index; }) })); });
    };
    var removeExistingFile = function (filename) {
        setEditData(function (prev) { return (__assign(__assign({}, prev), { existingAttachments: prev.existingAttachments.filter(function (f) { return f !== filename; }) })); });
    };
    var downloadFile = function (filename) {
        window.open("/api/assignments/download/".concat(filename), '_blank');
    };
    if (loading) {
        return (<div className={"p-6 rounded-lg ".concat(isDark ? 'bg-gray-800' : 'bg-white', " shadow-sm")}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(function (i) { return (<div key={i} className="h-20 bg-gray-300 rounded"></div>); })}
          </div>
        </div>
      </div>);
    }
    return (<div className={"p-6 rounded-lg ".concat(isDark ? 'bg-gray-800' : 'bg-white', " shadow-sm")}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className={"h-6 w-6 ".concat(isDark ? 'text-blue-400' : 'text-blue-600')}/>
          <h2 className={"text-xl font-semibold ".concat(isDark ? 'text-white' : 'text-gray-900')}>
            Assignment Management
          </h2>
        </div>
        <button onClick={function () { return window.location.href = '/teacher/assignments/create'; }} className={"px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ".concat(isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white')}>
          <Plus className="h-4 w-4"/>
          <span>New Assignment</span>
        </button>
      </div>

      {assignments.length === 0 ? (<div className={"text-center py-8 ".concat(isDark ? 'text-gray-400' : 'text-gray-500')}>
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50"/>
          <p>No assignments found. Create your first assignment!</p>
        </div>) : (<div className="space-y-4">
          {assignments.map(function (assignment) { return (<div key={assignment._id} className={"p-4 rounded-lg border transition-colors ".concat(isDark
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-200')}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={"font-semibold text-lg ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                    {assignment.title}
                  </h3>
                  <p className={"text-sm mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-600')}>
                    {assignment.course.subject} - Grade {assignment.course.gradeLevel}
                  </p>
                  <p className={"text-sm mb-3 ".concat(isDark ? 'text-gray-400' : 'text-gray-500')}>
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4"/>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {(function () {
                    if (!assignment.dueDate || assignment.dueDate.trim() === '') {
                        return 'Due: Not set';
                    }
                    var date = new Date(assignment.dueDate);
                    if (isNaN(date.getTime())) {
                        return 'Due: Invalid date';
                    }
                    return "Due: ".concat(date.toLocaleDateString(), " ").concat(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                })()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4"/>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {assignment.submissionCount || 0} submissions
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4"/>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {assignment.maxPoints} pts
                      </span>
                    </div>
                    <span className={"px-2 py-1 rounded-full text-xs ".concat(assignment.submissionType === 'file'
                    ? 'bg-blue-100 text-blue-800'
                    : assignment.submissionType === 'text'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800')}>
                      {assignment.submissionType === 'both' ? 'File & Text' : assignment.submissionType}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={function () { return handleEditAssignment(assignment); }} className={"p-2 rounded-lg transition-colors ".concat(isDark
                    ? 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700')}>
                    <Edit className="h-4 w-4"/>
                  </button>
                  <button onClick={function () { return handleDeleteAssignment(assignment._id); }} className={"p-2 rounded-lg transition-colors ".concat(isDark
                    ? 'hover:bg-red-600 text-gray-300 hover:text-white'
                    : 'hover:bg-red-100 text-gray-500 hover:text-red-700')}>
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              </div>
            </div>); })}
        </div>)}

      {/* Edit Assignment Modal */}
      {showEditModal && editingAssignment && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={"w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ".concat(isDark ? 'bg-gray-800' : 'bg-white')}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={"text-xl font-semibold ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                  Edit Assignment
                </h3>
                <button onClick={function () { return setShowEditModal(false); }} className={"p-2 rounded-lg transition-colors ".concat(isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500')}>
                  <X className="h-5 w-5"/>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Title
                  </label>
                  <input type="text" value={editData.title} onChange={function (e) { return setEditData(function (prev) { return (__assign(__assign({}, prev), { title: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}/>
                </div>

                <div>
                  <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Description
                  </label>
                  <textarea value={editData.description} onChange={function (e) { return setEditData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} rows={4} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                      Due Date
                    </label>
                    <input type="datetime-local" value={editData.dueDate} onChange={function (e) { return setEditData(function (prev) { return (__assign(__assign({}, prev), { dueDate: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}/>
                  </div>

                  <div>
                    <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                      Max Points
                    </label>
                    <input type="number" value={editData.maxPoints} onChange={function (e) { return setEditData(function (prev) { return (__assign(__assign({}, prev), { maxPoints: parseInt(e.target.value) })); }); }} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}/>
                  </div>
                </div>

                <div>
                  <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Submission Type
                  </label>
                  <select value={editData.submissionType} onChange={function (e) { return setEditData(function (prev) { return (__assign(__assign({}, prev), { submissionType: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}>
                    <option value="both">File & Text</option>
                    <option value="file">File Only</option>
                    <option value="text">Text Only</option>
                  </select>
                </div>

                {/* Existing Files */}
                {editData.existingAttachments.length > 0 && (<div>
                    <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                      Current Files
                    </label>
                    <div className="space-y-2">
                      {editData.existingAttachments.map(function (filename, index) { return (<div key={index} className={"flex items-center justify-between p-2 border rounded-lg ".concat(isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')}>
                          <span className={"text-sm ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                            {filename}
                          </span>
                          <div className="flex space-x-2">
                            <button onClick={function () { return downloadFile(filename); }} className={"p-1 rounded transition-colors ".concat(isDark
                        ? 'hover:bg-gray-600 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-500')}>
                              <Download className="h-4 w-4"/>
                            </button>
                            <button onClick={function () { return removeExistingFile(filename); }} className={"p-1 rounded transition-colors ".concat(isDark
                        ? 'hover:bg-red-600 text-gray-400'
                        : 'hover:bg-red-100 text-gray-500')}>
                              <X className="h-4 w-4"/>
                            </button>
                          </div>
                        </div>); })}
                    </div>
                  </div>)}

                {/* New Files */}
                <div>
                  <label className={"block text-sm font-medium mb-2 ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                    Add New Files
                  </label>
                  <input type="file" multiple onChange={handleFileChange} className={"w-full px-3 py-2 border rounded-lg ".concat(isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900')}/>
                  {editData.attachments.length > 0 && (<div className="mt-2 space-y-2">
                      {editData.attachments.map(function (file, index) { return (<div key={index} className={"flex items-center justify-between p-2 border rounded-lg ".concat(isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50')}>
                          <span className={"text-sm ".concat(isDark ? 'text-gray-300' : 'text-gray-700')}>
                            {file.name}
                          </span>
                          <button onClick={function () { return removeNewFile(index); }} className={"p-1 rounded transition-colors ".concat(isDark
                        ? 'hover:bg-red-600 text-gray-400'
                        : 'hover:bg-red-100 text-gray-500')}>
                            <X className="h-4 w-4"/>
                          </button>
                        </div>); })}
                    </div>)}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={function () { return setShowEditModal(false); }} className={"px-4 py-2 rounded-lg transition-colors ".concat(isDark
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700')}>
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className={"px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ".concat(isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white')}>
                  <Save className="h-4 w-4"/>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}

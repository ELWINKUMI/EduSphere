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
import { Plus, Eye, EyeOff, Users, Trash2, UserX, BookOpen, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ALL_GRADES } from '@/lib/schoolConfig';
import toast from 'react-hot-toast';
export default function StudentManagement() {
    var _this = this;
    var _a = useState([]), students = _a[0], setStudents = _a[1];
    // ...removed generateId state and logic...
    var _b = useState([]), enrolledStudents = _b[0], setEnrolledStudents = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), showCreateForm = _d[0], setShowCreateForm = _d[1];
    var _e = useState({}), showPins = _e[0], setShowPins = _e[1];
    var _f = useState(null), selectedStudent = _f[0], setSelectedStudent = _f[1];
    var _g = useState('enrolled'), activeTab = _g[0], setActiveTab = _g[1];
    var _h = useState(null), studentToRemove = _h[0], setStudentToRemove = _h[1];
    var _j = useState({
        name: '',
        pin: '',
        gradeLevel: ''
    }), formData = _j[0], setFormData = _j[1];
    var _k = useState(null), studentToDelete = _k[0], setStudentToDelete = _k[1];
    var handleDeleteStudent = function (studentId) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/students/delete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({ studentId: studentId })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 2];
                    toast.success('Student deleted successfully!');
                    fetchStudents();
                    setStudentToDelete(null);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to delete student');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    toast.error('Error deleting student');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchStudents();
        fetchEnrolledStudents();
    }, []);
    var fetchStudents = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/students', {
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
                    console.log('Fetched students:', data.students);
                    setStudents(data.students);
                    return [3 /*break*/, 4];
                case 3:
                    toast.error('Failed to fetch students');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    toast.error('Error fetching students');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var fetchEnrolledStudents = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/enrolled-students', {
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
                    setEnrolledStudents(data.students || []);
                    return [3 /*break*/, 4];
                case 3:
                    toast.error('Failed to fetch enrolled students');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    toast.error('Error fetching enrolled students');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var generatePin = function () {
        var pin = Math.floor(10000 + Math.random() * 90000).toString();
        setFormData(function (prev) { return (__assign(__assign({}, prev), { pin: pin })); });
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.name || !formData.pin || !formData.gradeLevel) {
                        toast.error('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    if (!/^[0-9]{5}$/.test(formData.pin)) {
                        toast.error('PIN must be exactly 5 digits');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/students', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify(formData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Student created successfully!');
                    setFormData({ name: '', pin: '', gradeLevel: '' });
                    setShowCreateForm(false);
                    fetchStudents();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to create student');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    toast.error('Error creating student');
                    return [3 /*break*/, 7];
                case 7:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var togglePinVisibility = function (studentId) {
        setShowPins(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[studentId] = !prev[studentId], _a)));
        });
    };
    var copyCredentials = function (student) { return __awaiter(_this, void 0, void 0, function () {
        var credentials, textArea, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credentials = "User ID: ".concat(student.userId || '[Not generated]', "\nPIN: ").concat(student.pin, "\nName: ").concat(student.name);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!(navigator.clipboard && window.isSecureContext)) return [3 /*break*/, 3];
                    return [4 /*yield*/, navigator.clipboard.writeText(credentials)];
                case 2:
                    _a.sent();
                    toast.success('Credentials copied to clipboard!');
                    return [3 /*break*/, 4];
                case 3:
                    textArea = document.createElement('textarea');
                    textArea.value = credentials;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        toast.success('Credentials copied to clipboard!');
                    }
                    catch (err) {
                        alert("Student Login Credentials:\n\n".concat(credentials));
                        toast.success('Credentials displayed - please copy manually');
                    }
                    document.body.removeChild(textArea);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    alert("Student Login Credentials:\n\n".concat(credentials));
                    toast.success('Credentials displayed - please copy manually');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveStudent = function (studentId, subjectId) { return __awaiter(_this, void 0, void 0, function () {
        var handleDeleteStudent, token, response, data, error_5;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleDeleteStudent = function (studentId) { return __awaiter(_this, void 0, void 0, function () {
                        var token, response, data, error_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, 6, 7]);
                                    setLoading(true);
                                    token = localStorage.getItem('token');
                                    return [4 /*yield*/, fetch('/api/students/delete', {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': "Bearer ".concat(token)
                                            },
                                            body: JSON.stringify({ studentId: studentId })
                                        })];
                                case 1:
                                    response = _a.sent();
                                    if (!response.ok) return [3 /*break*/, 2];
                                    toast.success('Student deleted successfully!');
                                    fetchStudents();
                                    setStudentToDelete(null);
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _a.sent();
                                    toast.error(data.error || 'Failed to delete student');
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    error_6 = _a.sent();
                                    toast.error('Error deleting student');
                                    return [3 /*break*/, 7];
                                case 6:
                                    setLoading(false);
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/teacher/remove-student', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify({ studentId: studentId, subjectId: subjectId })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Student removed from subject successfully!');
                    fetchEnrolledStudents(); // Refresh the enrolled students list
                    setStudentToRemove(null);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.error || 'Failed to remove student');
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_5 = _a.sent();
                    toast.error('Error removing student');
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2"/>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Students</h3>
        </div>
        <button onClick={function () { return setShowCreateForm(true); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2"/>
          Add Student
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
        <button onClick={function () { return setActiveTab('enrolled'); }} className={"flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'enrolled'
            ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white')}>
          <Users className="h-4 w-4 inline mr-2"/>
          Enrolled Students ({enrolledStudents.length})
        </button>
        <button onClick={function () { return setActiveTab('all'); }} className={"flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'all'
            ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white')}>
          <BookOpen className="h-4 w-4 inline mr-2"/>
          All Students ({students.length})
        </button>
      </div>

      {/* Create Student Form */}
      {showCreateForm && (<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Create New Student</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Student Name" value={formData.name} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} placeholder="Enter student's full name" required/>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade Level
                </label>
                <select value={formData.gradeLevel} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { gradeLevel: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" required>
                  <option value="">Select Grade Level</option>
                  <optgroup label="Primary School">
                    {ALL_GRADES.slice(0, 6).map(function (grade) { return (<option key={grade} value={grade}>{grade}</option>); })}
                  </optgroup>
                  <optgroup label="Junior High School">
                    {ALL_GRADES.slice(6, 9).map(function (grade) { return (<option key={grade} value={grade}>{grade}</option>); })}
                  </optgroup>
                  <optgroup label="Senior High School">
                    {ALL_GRADES.slice(9, 12).map(function (grade) { return (<option key={grade} value={grade}>{grade}</option>); })}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <Input label="5-Digit PIN" value={formData.pin} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { pin: e.target.value })); }); }} placeholder="Enter 5-digit PIN" maxLength={5} pattern="[0-9]{5}" required/>
                <button type="button" onClick={generatePin} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Generate Random PIN
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={function () {
                setShowCreateForm(false);
                setFormData({ name: '', pin: '', gradeLevel: '' });
            }} className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>)}

      {/* Tab Content */}
      {activeTab === 'enrolled' ? (
        // Enrolled Students Tab
        <div>
          {enrolledStudents.length === 0 ? (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"/>
              <p>No students enrolled in your subjects yet.</p>
              <p className="text-sm">Students will appear here when they join your subjects using the subject codes.</p>
            </div>) : (<div className="space-y-4">
              {enrolledStudents.map(function (student) { return (<div key={student._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        {student.gradeLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enrolled Subjects ({student.enrolledSubjects.length}):
                    </p>
                    {student.enrolledSubjects.map(function (subject) { return (<div key={subject._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{subject.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subject.subject} • {subject.gradeLevel}
                          </p>
                        </div>
                        <button onClick={function () { return setStudentToRemove({ student: student, subject: subject }); }} className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                          <UserX className="h-4 w-4 mr-1"/>
                          Remove
                        </button>
                      </div>); })}
                  </div>
                </div>); })}
            </div>)}
        </div>) : (
        // All Students Tab
        <div>
          {students.length === 0 ? (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"/>
              <p>No students created yet.</p>
              <p className="text-sm">Click "Add Student" to create your first student.</p>
            </div>) : (<div className="space-y-3">
              {students.map(function (student) { return (<div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        {student.gradeLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">{student.userId}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">PIN:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {showPins[student._id] ? student.pin : '•••••'}
                      </span>
                      <button onClick={function () { return togglePinVisibility(student._id); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showPins[student._id] ? (<EyeOff className="h-4 w-4"/>) : (<Eye className="h-4 w-4"/>)}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={function () { return setSelectedStudent(student); }} className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                      View Credentials
                    </button>
                    <button onClick={function () { return copyCredentials(student); }} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                      Copy Login Info
                    </button>
                    <button onClick={function () { return setStudentToDelete(student); }} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center" title="Delete Student">
                      <Trash2 className="h-4 w-4 mr-1"/> Delete
                    </button>
                  </div>
      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3"/>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Student</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>permanently delete</strong> <strong>{studentToDelete.name}</strong> from the system? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={function () { return setStudentToDelete(null); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={function () { return handleDeleteStudent(studentToDelete._id); }} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center">
                {loading ? (<>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>) : (<>
                    <Trash2 className="h-4 w-4 mr-2"/>
                    Delete Student
                  </>)}
              </button>
            </div>
          </div>
        </div>)}
                </div>); })}
            </div>)}
        </div>)}

      {/* Remove Student Confirmation Modal */}
      {studentToRemove && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3"/>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remove Student</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove <strong>{studentToRemove.student.name}</strong> from 
              <strong> {studentToRemove.subject.title}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button onClick={function () { return setStudentToRemove(null); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={function () { return handleRemoveStudent(studentToRemove.student._id, studentToRemove.subject._id); }} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center">
                {loading ? (<>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Removing...
                  </>) : (<>
                    <UserX className="h-4 w-4 mr-2"/>
                    Remove Student
                  </>)}
              </button>
            </div>
          </div>
        </div>)}

      {/* Credentials Modal */}
      {selectedStudent && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Login Credentials</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">User ID:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.userId || <span className='text-red-500'>Not generated</span>}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">PIN:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.pin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Student Name:</label>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Grade Level:</label>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedStudent.gradeLevel}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Instructions for student:</strong><br />
                1. Go to the login page<br />
                2. Enter the <strong>User ID</strong> and <strong>PIN</strong> as shown above<br />
                3. Click "Sign In"
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={function () { return setSelectedStudent(null); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Close
              </button>
              <button onClick={function () {
                copyCredentials(selectedStudent);
                setSelectedStudent(null);
            }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Copy & Close
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}

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
import { ArrowLeft, Clock, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
export default function CreateQuizPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState([]), subjects = _b[0], setSubjects = _b[1];
    var _c = useState(true), loadingSubjects = _c[0], setLoadingSubjects = _c[1];
    var _d = useState({
        title: '',
        description: '',
        courseId: '',
        timeLimit: '',
        maxAttempts: '1',
        showResults: 'immediately',
        startDate: '',
        endDate: ''
    }), formData = _d[0], setFormData = _d[1];
    var _e = useState([]), questions = _e[0], setQuestions = _e[1];
    useEffect(function () {
        if (user && user.role === 'teacher') {
            fetchSubjects();
        }
        else if (user && user.role !== 'teacher') {
            // Redirect non-teachers away from this page
            router.push("/".concat(user.role, "/dashboard"));
        }
    }, [user, router]);
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
                    toast.error('Error loading subjects');
                    return [3 /*break*/, 7];
                case 6:
                    setLoadingSubjects(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var addQuestion = function () {
        var newQuestion = {
            id: Date.now().toString(),
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            points: 1
        };
        setQuestions(__spreadArray(__spreadArray([], questions, true), [newQuestion], false));
    };
    var updateQuestion = function (id, field, value) {
        setQuestions(questions.map(function (q) {
            var _a;
            if (q.id === id) {
                var updatedQuestion = __assign(__assign({}, q), (_a = {}, _a[field] = value, _a));
                // Handle question type changes
                if (field === 'type') {
                    if (value === 'multiple-choice') {
                        // Ensure options array exists for multiple choice
                        updatedQuestion.options = updatedQuestion.options || ['', '', '', ''];
                    }
                    else if (value === 'true-false') {
                        // Clear options for true/false questions
                        updatedQuestion.options = undefined;
                    }
                    else if (value === 'short-answer') {
                        // Clear options for short answer questions
                        updatedQuestion.options = undefined;
                    }
                    // Reset correct answer when type changes
                    updatedQuestion.correctAnswer = '';
                }
                return updatedQuestion;
            }
            return q;
        }));
    };
    var updateQuestionOption = function (questionId, optionIndex, value) {
        setQuestions(questions.map(function (q) {
            if (q.id === questionId && q.options) {
                var newOptions = __spreadArray([], q.options, true);
                newOptions[optionIndex] = value;
                return __assign(__assign({}, q), { options: newOptions });
            }
            return q;
        }));
    };
    var removeQuestion = function (id) {
        setQuestions(questions.filter(function (q) { return q.id !== id; }));
    };
    // Fisher-Yates shuffle
    function shuffleArray(array) {
        var _a;
        var arr = __spreadArray([], array, true);
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
        }
        return arr;
    }
    // Shuffle options for each multiple-choice question and update correctAnswer
    function shuffleQuestionsAndOptions(questions) {
        return shuffleArray(questions).map(function (q) {
            var _a;
            if (q.type === 'multiple-choice' &&
                q.options &&
                q.options.length > 1 &&
                q.options.every(function (opt) { return opt && opt.trim() !== ''; })) {
                // Pair each option with a flag if it's the correct answer
                var optionPairs = q.options.map(function (opt) { return ({
                    value: opt,
                    isCorrect: opt === q.correctAnswer
                }); });
                // Shuffle the pairs
                var shuffledPairs = shuffleArray(optionPairs);
                // Find the new correct answer
                var newCorrect = ((_a = shuffledPairs.find(function (pair) { return pair.isCorrect; })) === null || _a === void 0 ? void 0 : _a.value) || '';
                return __assign(__assign({}, q), { options: shuffledPairs.map(function (pair) { return pair.value; }), correctAnswer: newCorrect });
            }
            return q;
        });
    }
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var _i, questions_1, question, shuffledQuestions, token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.title || !formData.courseId || questions.length === 0) {
                        toast.error('Please fill in all required fields and add at least one question');
                        return [2 /*return*/];
                    }
                    // Validate questions
                    for (_i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                        question = questions_1[_i];
                        if (!question.question || !question.correctAnswer) {
                            toast.error('All questions must have content and correct answers');
                            return [2 /*return*/];
                        }
                        if (question.type === 'multiple-choice' && (!question.options || question.options.some(function (opt) { return !opt || opt.trim() === ''; }))) {
                            toast.error('Multiple choice questions must have all options filled');
                            return [2 /*return*/];
                        }
                    }
                    shuffledQuestions = shuffleQuestionsAndOptions(questions);
                    console.log('Questions being sent:', shuffledQuestions.map(function (q) { return ({
                        type: q.type,
                        hasOptions: !!q.options,
                        options: q.options,
                        correctAnswer: q.correctAnswer
                    }); }));
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/quizzes', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: JSON.stringify(__assign(__assign({}, formData), { timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null, maxAttempts: parseInt(formData.maxAttempts), questions: shuffledQuestions })),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast.success('Quiz created successfully!');
                    router.push('/teacher/dashboard');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    toast.error(data.message || 'Failed to create quiz');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    toast.error('An error occurred. Please try again.');
                    return [3 /*break*/, 7];
                case 7:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        if (subjects.length === 1) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { courseId: subjects[0]._id })); });
        }
    }, [subjects]);
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>);
    }
    if (!user || user.role !== 'teacher') {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only teachers can access this page.</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 dark:bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/teacher/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back to Dashboard
              </Link>
              <div className="flex items-center">
          <div className="bg-purple-600 p-2 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-white"/>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                  <p className="text-gray-600">Create a timed quiz for your students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Settings */}
          <div className="bg-gray-900 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Quiz Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Chapter 5 Quiz" required/>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Course *
                </label>
                <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-4 py-3 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required disabled={loadingSubjects}>
                  <option value="">
                    {loadingSubjects ? 'Loading subjects...' : 'Select a subject/course'}
                  </option>
                  {subjects.map(function (subject) { return (<option key={subject._id} value={subject._id}>
                      {subject.subject} - Grade {subject.gradeLevel} ({subject.title})
                    </option>); })}
                </select>
              </div>
              
              <Input label="Time Limit (minutes)" name="timeLimit" type="number" value={formData.timeLimit} onChange={handleChange} placeholder="30" min="1" max="300"/>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attempts
                </label>
                <select name="maxAttempts" value={formData.maxAttempts} onChange={handleChange} className="w-full px-4 py-3 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="1">1 attempt</option>
                  <option value="2">2 attempts</option>
                  <option value="3">3 attempts</option>
                  <option value="-1">Unlimited</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show Results
                </label>
                <select name="showResults" value={formData.showResults} onChange={handleChange} className="w-full px-4 py-3 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="immediately">Show immediately after submission</option>
                  <option value="after-deadline">Show after quiz deadline</option>
                  <option value="manual">Show when manually released</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-3 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
              </div>
            </div>
            
            <div className="mt-6">
              <Textarea label="Quiz Description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide instructions and description for the quiz..." rows={3}/>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-gray-900 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-800 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <button type="button" onClick={addQuestion} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4 mr-2"/>
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (<div className="text-center py-8 text-gray-500">
                No questions added yet. Click "Add Question" to get started.
              </div>) : (<div className="space-y-6">
                {questions.map(function (question, index) {
                var _a;
                return (<div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium text-gray-900">Question {index + 1}</h4>
                      <button type="button" onClick={function () { return removeQuestion(question.id); }} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <Textarea label="Question" value={question.question} onChange={function (e) { return updateQuestion(question.id, 'question', e.target.value); }} placeholder="Enter your question..." rows={2}/>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select value={question.type} onChange={function (e) { return updateQuestion(question.id, 'type', e.target.value); }} className="w-full px-3 py-2 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>
                        </div>
                        
                        <Input label="Points" type="number" value={question.points.toString()} onChange={function (e) { return updateQuestion(question.id, 'points', parseInt(e.target.value) || 1); }} min="1" max="100"/>
                      </div>
                    </div>

                    {/* Question-specific inputs */}
                    {question.type === 'multiple-choice' && (<div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {(_a = question.options) === null || _a === void 0 ? void 0 : _a.map(function (option, optIndex) { return (<div key={optIndex} className="flex items-center space-x-3">
                            <input type="radio" name={"correct-".concat(question.id)} checked={question.correctAnswer === option} onChange={function () { return updateQuestion(question.id, 'correctAnswer', option); }} className="h-4 w-4 text-purple-600"/>
                            <input type="text" value={option} onChange={function (e) { return updateQuestionOption(question.id, optIndex, e.target.value); }} placeholder={"Option ".concat(optIndex + 1)} className="flex-1 px-3 py-2 text-gray-100 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                          </div>); })}
                      </div>)}

                    {question.type === 'true-false' && (<div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input type="radio" name={"tf-".concat(question.id)} value="True" checked={question.correctAnswer === 'True'} onChange={function (e) { return updateQuestion(question.id, 'correctAnswer', e.target.value); }} className="h-4 w-4 text-purple-600 mr-2"/>
                            True
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name={"tf-".concat(question.id)} value="False" checked={question.correctAnswer === 'False'} onChange={function (e) { return updateQuestion(question.id, 'correctAnswer', e.target.value); }} className="h-4 w-4 text-purple-600 mr-2"/>
                            False
                          </label>
                        </div>
                      </div>)}

                    {question.type === 'short-answer' && (<div>
                        <Input label="Sample Correct Answer" value={question.correctAnswer} onChange={function (e) { return updateQuestion(question.id, 'correctAnswer', e.target.value); }} placeholder="Enter a sample correct answer for reference..."/>
                      </div>)}
                  </div>);
            })}
              </div>)}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/teacher/dashboard" className="px-6 py-3 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading || questions.length === 0} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </main>
    </div>);
}

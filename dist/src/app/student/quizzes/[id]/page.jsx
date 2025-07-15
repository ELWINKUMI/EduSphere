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
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Play, BookOpen, Timer, Award, User, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
export default function StudentQuizDetailPage() {
    var _this = this;
    var _a;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    var quizId = params.id;
    var _b = useState(null), quiz = _b[0], setQuiz = _b[1];
    var _c = useState(null), submission = _c[0], setSubmission = _c[1];
    var _d = useState(true), loading = _d[0], setLoading = _d[1];
    useEffect(function () {
        if (quizId && user && user.role === 'student') {
            fetchQuizDetails();
        }
        else if (user && user.role !== 'student') {
            router.push('/auth/login');
        }
    }, [quizId, user, router]);
    var fetchQuizDetails = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/quizzes/".concat(quizId), {
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
                    setQuiz(data.quiz);
                    setSubmission(data.submission || null);
                    return [3 /*break*/, 4];
                case 3:
                    if (response.status === 404) {
                        toast.error('Quiz not found');
                        router.push('/student/quizzes');
                    }
                    else {
                        toast.error('Failed to load quiz details');
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching quiz details:', error_1);
                    toast.error('Error loading quiz details');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var isQuizAvailable = function () {
        if (!quiz)
            return false;
        var now = new Date();
        var startDate = new Date(quiz.startDate);
        var endDate = new Date(quiz.endDate);
        return now >= startDate && now <= endDate && quiz.isActive;
    };
    var getQuizStatus = function () {
        if (!quiz)
            return 'loading';
        if (submission) {
            return 'completed';
        }
        var now = new Date();
        var endDate = new Date(quiz.endDate);
        if (now > endDate) {
            return 'expired';
        }
        if (isQuizAvailable()) {
            return 'available';
        }
        return 'upcoming';
    };
    var getTotalPoints = function () {
        if (!quiz || !quiz.questions)
            return 0;
        return quiz.questions.reduce(function (total, q) { return total + q.points; }, 0);
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    if (!quiz) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The quiz you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/student/quizzes" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Quizzes
          </Link>
        </div>
      </div>);
    }
    var status = getQuizStatus();
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/student/quizzes" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {quiz.course.subject} • {quiz.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {status === 'completed' ? (<span className="flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1"/>
                  Completed
                </span>) : status === 'available' ? (<span className="flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">
                  <Play className="h-4 w-4 mr-1"/>
                  Available
                </span>) : status === 'expired' ? (<span className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                  <AlertCircle className="h-4 w-4 mr-1"/>
                  Expired
                </span>) : (<span className="flex items-center px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                  <Clock className="h-4 w-4 mr-1"/>
                  Upcoming
                </span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Available From:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(quiz.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Due Date:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(quiz.endDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Time Limit:</span>
                  <p className="text-gray-600 dark:text-gray-400">{quiz.timeLimit} minutes</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Questions:</span>
                  <p className="text-gray-600 dark:text-gray-400">{((_a = quiz.questions) === null || _a === void 0 ? void 0 : _a.length) || 0} questions</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Total Points:</span>
                  <p className="text-gray-600 dark:text-gray-400">{getTotalPoints()} points</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Attempts Allowed:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {quiz.attempts === 999 ? 'Unlimited' : quiz.attempts}
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start">
                  <Timer className="h-5 w-5 text-blue-500 mr-3 mt-0.5"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Time Management</p>
                    <p className="text-sm">You have {quiz.timeLimit} minutes to complete this quiz. The timer will start when you begin.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-green-500 mr-3 mt-0.5"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Submission</p>
                    <p className="text-sm">Your quiz will be automatically submitted when time expires or when you click submit.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Important</p>
                    <p className="text-sm">Make sure you have a stable internet connection. You cannot pause the quiz once started.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display */}
            {submission && (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Result</h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Score: {submission.score}/{submission.maxScore}
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round((submission.score / submission.maxScore) * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                    <div>
                      <span className="font-medium">Completed:</span>
                      <p>{new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Time Spent:</span>
                      <p>{Math.floor(submission.timeSpent / 60)}:{(submission.timeSpent % 60).toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                </div>
              </div>)}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {status === 'available' && !submission && (<Link href={"/student/quizzes/".concat(quiz._id, "/take")} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Play className="h-5 w-5 mr-2"/>
                  Start Quiz
                </Link>)}
              
              {submission && (<Link href={"/student/quizzes/".concat(quiz._id, "/results")} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <Award className="h-5 w-5 mr-2"/>
                  View Detailed Results
                </Link>)}
              
              <Link href="/student/quizzes" className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                Back to Quizzes
              </Link>
            </div>
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
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.course.subject} • Grade {quiz.course.gradeLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.teacher.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={"/student/courses/".concat(quiz.course._id)} className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <BookOpen className="h-4 w-4 mr-2"/>
                  View Course
                </Link>
                <Link href="/student/quizzes" className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Clock className="h-4 w-4 mr-2"/>
                  All Quizzes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

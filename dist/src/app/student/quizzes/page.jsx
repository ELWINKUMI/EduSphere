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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, CheckCircle, AlertCircle, Play, BookOpen, Timer, Award } from 'lucide-react';
import toast from 'react-hot-toast';
export default function StudentQuizzesPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var _a = useState([]), quizzes = _a[0], setQuizzes = _a[1];
    var _b = useState([]), submissions = _b[0], setSubmissions = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState('all'), filter = _d[0], setFilter = _d[1];
    useEffect(function () {
        if (user && user.role === 'student') {
            fetchQuizzes();
            fetchSubmissions();
        }
        else if (user && user.role !== 'student') {
            router.push('/auth/login');
        }
    }, [user, router]);
    var fetchQuizzes = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/quizzes', {
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
                    return [3 /*break*/, 4];
                case 3:
                    toast.error('Failed to load quizzes');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching quizzes:', error_1);
                    toast.error('Error loading quizzes');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var fetchSubmissions = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch('/api/quiz-submissions', {
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
                    setSubmissions(data.submissions || []);
                    return [3 /*break*/, 4];
                case 3:
                    console.error('Failed to load quiz submissions');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error fetching quiz submissions:', error_2);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var isQuizAvailable = function (quiz) {
        var now = new Date();
        var startDate = new Date(quiz.startDate);
        var endDate = new Date(quiz.endDate);
        return now >= startDate && now <= endDate && quiz.isActive;
    };
    var getQuizStatus = function (quiz) {
        var submission = submissions.find(function (s) { return s.quiz === quiz._id; });
        var now = new Date();
        var endDate = new Date(quiz.endDate);
        if (submission) {
            return 'completed';
        }
        if (now > endDate) {
            return 'expired';
        }
        if (isQuizAvailable(quiz)) {
            return 'available';
        }
        return 'upcoming';
    };
    var filteredQuizzes = quizzes.filter(function (quiz) {
        var status = getQuizStatus(quiz);
        switch (filter) {
            case 'available':
                return status === 'available';
            case 'completed':
                return status === 'completed';
            default:
                return true;
        }
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500"/>;
            case 'available':
                return <Play className="h-5 w-5 text-blue-500"/>;
            case 'expired':
                return <AlertCircle className="h-5 w-5 text-red-500"/>;
            default:
                return <Clock className="h-5 w-5 text-yellow-500"/>;
        }
    };
    var getStatusText = function (status) {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'available':
                return 'Available';
            case 'expired':
                return 'Expired';
            default:
                return 'Upcoming';
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/student/dashboard" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4">
                <ArrowLeft className="h-5 w-5 mr-1"/>
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Quizzes</h1>
                <p className="text-gray-600 dark:text-gray-400">Take quizzes and view your results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button onClick={function () { return setFilter('all'); }} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat(filter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700')}>
              All Quizzes ({quizzes.length})
            </button>
            <button onClick={function () { return setFilter('available'); }} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat(filter === 'available'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700')}>
              Available ({quizzes.filter(function (q) { return getQuizStatus(q) === 'available'; }).length})
            </button>
            <button onClick={function () { return setFilter('completed'); }} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat(filter === 'completed'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700')}>
              Completed ({submissions.length})
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (<div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'available' && 'No quizzes available'}
              {filter === 'completed' && 'No completed quizzes'}
              {filter === 'all' && 'No quizzes found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'available' && 'Check back later for new quizzes from your teachers.'}
              {filter === 'completed' && 'Complete some quizzes to see your results here.'}
              {filter === 'all' && 'Your teachers haven\'t created any quizzes yet.'}
            </p>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(function (quiz) {
                var status = getQuizStatus(quiz);
                var submission = submissions.find(function (s) { return s.quiz === quiz._id; });
                return (<div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className={"ml-2 text-sm font-medium ".concat(status === 'completed' ? 'text-green-700 dark:text-green-400' :
                        status === 'available' ? 'text-blue-700 dark:text-blue-400' :
                            status === 'expired' ? 'text-red-700 dark:text-red-400' :
                                'text-yellow-700 dark:text-yellow-400')}>
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-2"/>
                      {quiz.course.subject} - Grade {quiz.course.gradeLevel}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Timer className="h-4 w-4 mr-2"/>
                      {quiz.timeLimit} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2"/>
                      Due: {new Date(quiz.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {submission && (<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Score: {submission.score}/{submission.maxScore}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {Math.round((submission.score / submission.maxScore) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Completed on {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>)}

                  <div className="flex gap-2">
                    {status === 'available' && (<Link href={"/student/quizzes/".concat(quiz._id, "/take")} className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Play className="h-4 w-4 mr-2"/>
                        Take Quiz
                      </Link>)}
                    
                    {submission && (<Link href={"/student/quizzes/".concat(quiz._id, "/results")} className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                        View Results
                      </Link>)}
                    
                    <Link href={"/student/quizzes/".concat(quiz._id)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                      Details
                    </Link>
                  </div>
                </div>);
            })}
          </div>)}
      </div>
    </div>);
}

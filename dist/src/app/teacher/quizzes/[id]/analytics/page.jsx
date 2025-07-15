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
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Target, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function QuizAnalyticsPage() {
    var _this = this;
    var user = useAuth().user;
    var params = useParams();
    var router = useRouter();
    var _a = useState(null), analytics = _a[0], setAnalytics = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        if (user && user.role === 'teacher') {
            fetchAnalytics();
        }
        else if (user && user.role !== 'teacher') {
            router.push("/".concat(user.role, "/dashboard"));
        }
    }, [user, router]);
    var fetchAnalytics = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, errorData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, fetch("/api/quizzes/".concat(params.id, "/analytics"), {
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
                    setAnalytics(data);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    toast.error(errorData.message || 'Failed to load analytics');
                    router.push('/teacher/dashboard');
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error fetching analytics:', error_1);
                    toast.error('Error loading analytics');
                    router.push('/teacher/dashboard');
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var formatTime = function (minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        if (hours > 0) {
            return "".concat(hours, "h ").concat(mins, "m");
        }
        return "".concat(mins, "m");
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
    var getScoreColor = function (percentage) {
        if (percentage >= 90)
            return 'text-green-600 bg-green-50';
        if (percentage >= 80)
            return 'text-blue-600 bg-blue-50';
        if (percentage >= 70)
            return 'text-yellow-600 bg-yellow-50';
        if (percentage >= 60)
            return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>);
    }
    if (!analytics) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
          <Link href="/teacher/dashboard" className="text-purple-600 hover:text-purple-700">
            Return to Dashboard
          </Link>
        </div>
      </div>);
    }
    var quiz = analytics.quiz, statistics = analytics.statistics, submissions = analytics.submissions;
    return (<div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/teacher/dashboard" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600"/>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quiz.title} - Analytics</h1>
              <p className="text-gray-600 mt-1">
                {quiz.course.subject} - Grade {quiz.course.gradeLevel} • {quiz.course.title}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.completionRate}%</p>
                <p className="text-xs text-gray-500">
                  {statistics.totalSubmissions} of {statistics.totalStudents} students
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}%</p>
                <p className="text-xs text-gray-500">
                  Out of {quiz.maxScore} points
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(quiz.timeLimit)}</p>
                <p className="text-xs text-gray-500">
                  {quiz.totalQuestions} questions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600"/>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalSubmissions}</p>
                <p className="text-xs text-gray-500">
                  Active quiz
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-5 w-5 text-gray-600 mr-2"/>
              <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {statistics.scoreData.map(function (data) { return (<div key={data.range} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {data.range}%
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full transition-all duration-300" style={{ width: "".concat(data.percentage, "%") }}></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-gray-900">{data.count}</span>
                    <span className="text-xs text-gray-500 ml-1">({data.percentage}%)</span>
                  </div>
                </div>); })}
            </div>

            {statistics.totalSubmissions === 0 && (<div className="text-center py-8 text-gray-500">
                No submissions yet
              </div>)}
          </div>

          {/* Student Results */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Results</h3>
            
            <div className="max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (<div className="text-center py-8 text-gray-500">
                  No submissions yet
                </div>) : (<div className="space-y-3">
                  {submissions.map(function (submission) { return (<div key={submission._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{submission.student.name}</p>
                        <p className="text-sm text-gray-500">
                          Submitted {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(getScoreColor(submission.percentage))}>
                          {submission.percentage}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {submission.score}/{submission.maxScore} pts
                        </p>
                        {submission.timeSpent && (<p className="text-xs text-gray-500">
                            Time: {formatTime(submission.timeSpent)}
                          </p>)}
                      </div>
                    </div>); })}
                </div>)}
            </div>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{quiz.description || 'No description provided'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quiz Schedule</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Start:</span> {formatDate(quiz.startDate)}</p>
                <p><span className="font-medium">End:</span> {formatDate(quiz.endDate)}</p>
                <p><span className="font-medium">Results:</span> {quiz.showResults === 'immediately' ? 'Show immediately' :
            quiz.showResults === 'after-deadline' ? 'Show after deadline' :
                'Manual release'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

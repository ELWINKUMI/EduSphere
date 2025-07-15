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
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Plus, Target, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function TeacherQuizzesPage() {
    var _this = this;
    var user = useAuth().user;
    var isDark = useTheme().isDark;
    var router = useRouter();
    var _a = useState([]), quizzes = _a[0], setQuizzes = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        if (user && user.role === 'teacher') {
            fetchQuizzes();
        }
        else if (user && user.role !== 'teacher') {
            router.push("/".concat(user.role, "/dashboard"));
        }
    }, [user, router]);
    var fetchQuizzes = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
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
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching quizzes:', error_1);
                    toast.error('Error loading quizzes');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
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
    var formatTime = function (minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        if (hours > 0) {
            return "".concat(hours, "h ").concat(mins, "m");
        }
        return "".concat(mins, "m");
    };
    var getQuizStatus = function (quiz) {
        var now = new Date();
        var startDate = new Date(quiz.startDate);
        var endDate = new Date(quiz.endDate);
        if (now < startDate)
            return { status: 'upcoming', color: 'blue' };
        if (now > endDate)
            return { status: 'ended', color: 'gray' };
        return { status: 'active', color: 'green' };
    };
    if (loading) {
        return (<div className={"min-h-screen transition-colors duration-200 ".concat(isDark ? 'bg-gray-900' : 'bg-gray-50', " flex items-center justify-center")}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>);
    }
    return (<div className={"min-h-screen transition-colors duration-200 ".concat(isDark ? 'bg-gray-900' : 'bg-gray-50')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/teacher/dashboard" className={"mr-4 p-2 hover:bg-gray-100 ".concat(isDark ? 'hover:bg-gray-800' : '', " rounded-lg transition-colors")}>
                <ArrowLeft className={"h-5 w-5 ".concat(isDark ? 'text-gray-400' : 'text-gray-600')}/>
              </Link>
              <div>
                <h1 className={"text-3xl font-bold transition-colors duration-200 ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                  My Quizzes
                </h1>
                <p className={"transition-colors duration-200 ".concat(isDark ? 'text-gray-400' : 'text-gray-600', " mt-1")}>
                  Manage and view analytics for your quizzes
                </p>
              </div>
            </div>
            <Link href="/teacher/quizzes/create" className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="h-5 w-5 mr-2"/>
              Create Quiz
            </Link>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (<div className={"transition-colors duration-200 ".concat(isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border', " rounded-xl shadow-sm p-12 text-center")}>
            <Target className={"h-16 w-16 ".concat(isDark ? 'text-gray-600' : 'text-gray-400', " mx-auto mb-4")}/>
            <h3 className={"text-xl font-semibold ".concat(isDark ? 'text-white' : 'text-gray-900', " mb-2")}>
              No quizzes yet
            </h3>
            <p className={"".concat(isDark ? 'text-gray-400' : 'text-gray-600', " mb-6")}>
              Create your first quiz to get started with student assessments.
            </p>
            <Link href="/teacher/quizzes/create" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="h-5 w-5 mr-2"/>
              Create Your First Quiz
            </Link>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {quizzes.map(function (quiz) {
                var status = getQuizStatus(quiz);
                return (<div key={quiz._id} className={"transition-colors duration-200 ".concat(isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border', " rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow")}>
                  {/* Quiz Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={"text-lg font-semibold ".concat(isDark ? 'text-white' : 'text-gray-900', " mb-1")}>
                        {quiz.title}
                      </h3>
                      <p className={"text-sm ".concat(isDark ? 'text-gray-400' : 'text-gray-600')}>
                        {quiz.course.subject} - Grade {quiz.course.gradeLevel}
                      </p>
                    </div>
                    <div className={"px-2.5 py-1 rounded-full text-xs font-medium ".concat(status.color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : status.color === 'blue'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800')}>
                      {status.status}
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={"text-2xl font-bold ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                        {quiz.totalQuestions}
                      </div>
                      <div className={"text-xs ".concat(isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Questions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={"text-2xl font-bold ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                        {quiz.submissions.length}
                      </div>
                      <div className={"text-xs ".concat(isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Submissions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={"text-2xl font-bold ".concat(isDark ? 'text-white' : 'text-gray-900')}>
                        {formatTime(quiz.timeLimit)}
                      </div>
                      <div className={"text-xs ".concat(isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Time Limit
                      </div>
                    </div>
                  </div>

                  {/* Quiz Details */}
                  <div className={"text-sm ".concat(isDark ? 'text-gray-400' : 'text-gray-600', " mb-4 space-y-1")}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2"/>
                      <span>Ends: {formatDate(quiz.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2"/>
                      <span>
                        Results: {quiz.showResults === 'immediately' ? 'Immediate' :
                        quiz.showResults === 'after-deadline' ? 'After deadline' :
                            'Manual release'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={"/teacher/quizzes/".concat(quiz._id, "/analytics")} className="flex items-center flex-1 justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <BarChart3 className="h-4 w-4 mr-2"/>
                      Analytics
                    </Link>
                    <Link href={"/student/quizzes/".concat(quiz._id)} className={"flex items-center px-4 py-2 ".concat(isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200', " rounded-lg transition-colors text-sm")}>
                      <Eye className="h-4 w-4"/>
                    </Link>
                  </div>
                </div>);
            })}
          </div>)}
      </div>
    </div>);
}

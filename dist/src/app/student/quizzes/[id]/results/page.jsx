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
import { ArrowLeft, CheckCircle, XCircle, Clock, User, BookOpen, Award } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function QuizResultsPage() {
    var _this = this;
    var _a;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    var quizId = params.id;
    var _b = useState(null), quiz = _b[0], setQuiz = _b[1];
    var _c = useState(null), submission = _c[0], setSubmission = _c[1];
    var _d = useState(false), canShowResults = _d[0], setCanShowResults = _d[1];
    var _e = useState(''), message = _e[0], setMessage = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    useEffect(function () {
        if (quizId) {
            fetchQuizResults();
        }
    }, [quizId]);
    var fetchQuizResults = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, errorData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 10]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/auth/login');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("/api/quizzes/".concat(quizId, "/results"), {
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
                    setSubmission(data.submission);
                    setCanShowResults(data.canShowResults);
                    setMessage(data.message);
                    if (!data.canShowResults) {
                        toast(data.message);
                    }
                    return [3 /*break*/, 7];
                case 3:
                    if (!(response.status === 404)) return [3 /*break*/, 4];
                    toast.error('Quiz results not found');
                    router.push('/student/quizzes');
                    return [3 /*break*/, 7];
                case 4:
                    if (!(response.status === 401)) return [3 /*break*/, 5];
                    toast.error('Please log in to view results');
                    router.push('/auth/login');
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, response.json()];
                case 6:
                    errorData = _a.sent();
                    toast.error(errorData.error || 'Failed to load quiz results');
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error fetching quiz results:', error_1);
                    toast.error('Error loading quiz results');
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>);
    }
    if (!quiz || !submission || !canShowResults) {
        // Show a clear, prominent message and do NOT show any score/answers
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
          <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4"/>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {(quiz === null || quiz === void 0 ? void 0 : quiz.title) || 'Quiz Results Not Available'}
          </h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">
            {message || 'Quiz results are not available yet. Please check back later.'}
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 max-w-md mx-auto mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h3>
            {quiz && quiz.course && (<div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{quiz.course.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{quiz.course.gradeLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Teacher:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{quiz.teacher.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(submission === null || submission === void 0 ? void 0 : submission.submittedAt) ? new Date(submission.submittedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(_a = submission === null || submission === void 0 ? void 0 : submission.timeSpent) !== null && _a !== void 0 ? _a : '-'} minutes
                  </span>
                </div>
              </div>)}
          </div>
          <Link href="/student/quizzes" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Quizzes
          </Link>
        </div>
      </div>);
    }
    var percentage = Math.round((submission.score / submission.maxScore) * 100);
    var getGrade = function (percent) {
        if (percent >= 90)
            return { grade: 'A+', color: 'text-green-600 dark:text-green-400' };
        if (percent >= 80)
            return { grade: 'A', color: 'text-green-600 dark:text-green-400' };
        if (percent >= 70)
            return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' };
        if (percent >= 60)
            return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
        if (percent >= 50)
            return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' };
        return { grade: 'F', color: 'text-red-600 dark:text-red-400' };
    };
    var gradeInfo = getGrade(percentage);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title} - Results</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {quiz.course.title} • {quiz.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={"text-2xl font-bold ".concat(gradeInfo.color)}>
                {gradeInfo.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {submission.score}/{submission.maxScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
                </div>
                <div className="text-center">
                  <div className={"text-2xl font-bold ".concat(gradeInfo.color)}>
                    {gradeInfo.grade}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {submission.timeSpent}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Used</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question-by-Question Results</h3>
              <div className="space-y-6">
                {quiz.questions.map(function (question, index) {
            var studentAnswer = submission.answers.find(function (a) { return a.questionIndex === index; });
            var isCorrect = (studentAnswer === null || studentAnswer === void 0 ? void 0 : studentAnswer.answer) === question.correctAnswer;
            return (<div key={index} className={"border rounded-lg p-4 ".concat(isCorrect
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20')}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Question {index + 1}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400"/>) : (<XCircle className="h-5 w-5 text-red-600 dark:text-red-400"/>)}
                          <span className="text-sm font-medium">
                            {isCorrect ? question.points : 0}/{question.points} pts
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {question.question}
                      </p>
                      
                      {question.type === 'multiple-choice' && question.options && (<div className="mb-3">
                          <div className="grid grid-cols-1 gap-2">
                            {question.options.map(function (option, optionIndex) { return (<div key={optionIndex} className={"p-2 rounded border text-sm ".concat(option === question.correctAnswer
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                            : option === (studentAnswer === null || studentAnswer === void 0 ? void 0 : studentAnswer.answer)
                                ? 'border-red-500 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300')}>
                                {option}
                                {option === question.correctAnswer && (<span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ Correct</span>)}
                                {option === (studentAnswer === null || studentAnswer === void 0 ? void 0 : studentAnswer.answer) && option !== question.correctAnswer && (<span className="ml-2 text-red-600 dark:text-red-400 font-medium">✗ Your Answer</span>)}
                              </div>); })}
                          </div>
                        </div>)}
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Answer:</span>
                          <p className={"text-sm ".concat(isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')}>
                            {(studentAnswer === null || studentAnswer === void 0 ? void 0 : studentAnswer.answer) || 'No answer provided'}
                          </p>
                        </div>
                        {!isCorrect && (<div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answer:</span>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              {question.correctAnswer}
                            </p>
                          </div>)}
                      </div>
                    </div>);
        })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-3"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{quiz.course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.course.subject} • {quiz.course.gradeLevel}
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
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href={"/student/quizzes/".concat(quiz._id)} className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Award className="h-4 w-4 mr-2"/>
                  Quiz Details
                </Link>
                <Link href="/student/quizzes" className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <BookOpen className="h-4 w-4 mr-2"/>
                  All Quizzes
                </Link>
                <Link href="/student/dashboard" className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <User className="h-4 w-4 mr-2"/>
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

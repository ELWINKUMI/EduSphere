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
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
export default function TakeQuizPage() {
    var _this = this;
    var user = useAuth().user;
    var router = useRouter();
    var params = useParams();
    var quizId = params.id;
    var _a = useState(null), quiz = _a[0], setQuiz = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(false), submitting = _c[0], setSubmitting = _c[1];
    var _d = useState({}), answers = _d[0], setAnswers = _d[1];
    var _e = useState(0), currentQuestion = _e[0], setCurrentQuestion = _e[1];
    var _f = useState(0), timeLeft = _f[0], setTimeLeft = _f[1];
    var _g = useState(false), quizStarted = _g[0], setQuizStarted = _g[1];
    var _h = useState(false), quizSubmitted = _h[0], setQuizSubmitted = _h[1];
    var _j = useState(null), submission = _j[0], setSubmission = _j[1];
    useEffect(function () {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);
    // Timer effect
    useEffect(function () {
        if (quizStarted && timeLeft > 0 && !quizSubmitted) {
            var timer_1 = setInterval(function () {
                setTimeLeft(function (prev) {
                    if (prev <= 1) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return function () { return clearInterval(timer_1); };
        }
    }, [quizStarted, timeLeft, quizSubmitted]);
    var fetchQuiz = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/auth/login');
                        return [2 /*return*/];
                    }
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
                    console.log('Quiz data received:', data.quiz);
                    if (data.quiz && data.quiz.questions) {
                        console.log('Questions:', data.quiz.questions.map(function (q) { return ({
                            type: q.type,
                            hasOptions: !!q.options,
                            optionsLength: q.options ? q.options.length : 0,
                            options: q.options
                        }); }));
                    }
                    setQuiz(data.quiz);
                    // Check if student already submitted
                    if (data.submission) {
                        setSubmission(data.submission);
                        setQuizSubmitted(true);
                        setAnswers(data.submission.answers || {});
                    }
                    return [3 /*break*/, 4];
                case 3:
                    if (response.status === 404) {
                        toast.error('Quiz not found');
                        router.push('/student/quizzes');
                    }
                    else {
                        toast.error('Failed to load quiz');
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching quiz:', error_1);
                    toast.error('Error loading quiz');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var startQuiz = function () {
        if (!quiz)
            return;
        setQuizStarted(true);
        setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
        toast.success('Quiz started! Good luck!');
    };
    var handleAnswerChange = function (questionId, answer) {
        setAnswers(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = answer, _a)));
        });
    };
    var handleAutoSubmit = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (quizSubmitted)
                        return [2 /*return*/];
                    toast.error('Time is up! Submitting quiz automatically...');
                    return [4 /*yield*/, submitQuiz(true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [quizSubmitted]);
    var submitQuiz = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (isAutoSubmit) {
            var token, response, data, error, error_2;
            if (isAutoSubmit === void 0) { isAutoSubmit = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (submitting || quizSubmitted)
                            return [2 /*return*/];
                        setSubmitting(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        token = localStorage.getItem('token');
                        return [4 /*yield*/, fetch("/api/quizzes/".concat(quizId, "/submit"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(token)
                                },
                                body: JSON.stringify({
                                    answers: answers,
                                    submittedAt: new Date().toISOString()
                                })
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        setSubmission(data.submission);
                        setQuizSubmitted(true);
                        if (isAutoSubmit) {
                            toast.success('Quiz submitted automatically due to time limit');
                        }
                        else {
                            toast.success('Quiz submitted successfully!');
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        error = _a.sent();
                        toast.error(error.message || 'Failed to submit quiz');
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        error_2 = _a.sent();
                        console.error('Error submitting quiz:', error_2);
                        toast.error('Error submitting quiz');
                        return [2 /*return*/];
                    case 8:
                        setSubmitting(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    var formatTime = function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return "".concat(minutes, ":").concat(remainingSeconds.toString().padStart(2, '0'));
    };
    var getTimeColor = function () {
        if (timeLeft > 300)
            return 'text-green-600 dark:text-green-400'; // > 5 minutes
        if (timeLeft > 60)
            return 'text-yellow-600 dark:text-yellow-400'; // > 1 minute
        return 'text-red-600 dark:text-red-400'; // < 1 minute
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
    // Check if quiz is available
    var now = new Date();
    var startDate = new Date(quiz.startDate);
    var endDate = new Date(quiz.endDate);
    var isAvailable = now >= startDate && now <= endDate;
    if (!isAvailable) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {now < startDate
                ? "This quiz will be available on ".concat(startDate.toLocaleDateString())
                : "This quiz ended on ".concat(endDate.toLocaleDateString())}
          </p>
          <Link href="/student/quizzes" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Quizzes
          </Link>
        </div>
      </div>);
    }
    // Show results if quiz is submitted
    if (quizSubmitted && submission) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your quiz has been submitted successfully.
            </p>
            
            {submission.isGraded && (<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Score</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {submission.score}/{submission.totalPoints}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {Math.round((submission.score / submission.totalPoints) * 100)}%
                </p>
              </div>)}
            
            <div className="flex justify-center space-x-4">
              <Link href="/student/quizzes" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Back to Quizzes
              </Link>
              <Link href="/student/dashboard" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>);
    }
    // Quiz start screen
    if (!quizStarted) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4"/>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quiz Details</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Questions: {quiz.questions.length}</li>
                  <li>Time Limit: {quiz.timeLimit} minutes</li>
                  <li>Total Points: {quiz.questions.reduce(function (sum, q) { return sum + q.points; }, 0)}</li>
                  <li>Attempts Allowed: {quiz.attempts === 999 ? 'Unlimited' : quiz.attempts}</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Course Information</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Subject: {quiz.course.subject}</li>
                  <li>Grade: {quiz.course.gradeLevel}</li>
                  <li>Teacher: {quiz.teacher.name}</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Instructions</h3>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                <li>• Make sure you have a stable internet connection</li>
                <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>
                <li>• The quiz will auto-submit when time expires</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• Review your answers before final submission</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link href={"/student/quizzes/".concat(quiz._id)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Back to Quiz Details
              </Link>
              <button onClick={startQuiz} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>);
    }
    // Quiz taking interface
    var currentQ = quiz.questions[currentQuestion];
    var progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with timer */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={"flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ".concat(getTimeColor())}>
                <Clock className="h-4 w-4 mr-2"/>
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: "".concat(progress, "%") }}></div>
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {currentQuestion + 1}
              </h2>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded">
                {currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQ.type === 'multiple-choice' && currentQ.options && (<div className="space-y-3">
                {currentQ.options.length > 0 ? currentQ.options.map(function (option, index) { return (<label key={index} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name={"question-".concat(currentQ._id)} value={option} checked={answers[currentQ._id] === option} onChange={function (e) { return handleAnswerChange(currentQ._id, e.target.value); }} className="h-4 w-4 text-blue-600 mr-3"/>
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>); }) : (<div className="text-red-500 p-3 border border-red-200 rounded-lg">
                    No options available for this question. Please contact your teacher.
                  </div>)}
              </div>)}
            
            {currentQ.type === 'multiple-choice' && (!currentQ.options || currentQ.options.length === 0) && (<div className="text-red-500 p-3 border border-red-200 rounded-lg">
                No options available for this question. Please contact your teacher.
              </div>)}

            {currentQ.type === 'true-false' && (<div className="space-y-3">
                {['True', 'False'].map(function (option) { return (<label key={option} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name={"question-".concat(currentQ._id)} value={option} checked={answers[currentQ._id] === option} onChange={function (e) { return handleAnswerChange(currentQ._id, e.target.value); }} className="h-4 w-4 text-blue-600 mr-3"/>
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>); })}
              </div>)}

            {currentQ.type === 'short-answer' && (<textarea value={answers[currentQ._id] || ''} onChange={function (e) { return handleAnswerChange(currentQ._id, e.target.value); }} placeholder="Enter your answer here..." rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>)}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button onClick={function () { return setCurrentQuestion(Math.max(0, currentQuestion - 1)); }} disabled={currentQuestion === 0} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestion < quiz.questions.length - 1 ? (<button onClick={function () { return setCurrentQuestion(currentQuestion + 1); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Next
                </button>) : (<button onClick={function () { return submitQuiz(); }} disabled={submitting} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>)}
            </div>
          </div>

          {/* Question navigation */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Navigation:</p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentQuestion(index); }} className={"w-8 h-8 rounded text-sm font-medium transition-colors ".concat(index === currentQuestion
                ? 'bg-blue-600 text-white'
                : answers[quiz.questions[index]._id]
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600')}>
                  {index + 1}
                </button>); })}
            </div>
          </div>
        </div>
      </div>
    </div>);
}

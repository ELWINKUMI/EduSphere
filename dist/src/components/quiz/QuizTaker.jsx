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
import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
export default function QuizTaker(_a) {
    var _this = this;
    var quiz = _a.quiz, onSubmit = _a.onSubmit;
    var _b = useState(quiz.timeLimit * 60), timeLeft = _b[0], setTimeLeft = _b[1]; // Convert to seconds
    var _c = useState({}), answers = _c[0], setAnswers = _c[1];
    var _d = useState(0), currentQuestion = _d[0], setCurrentQuestion = _d[1];
    var _e = useState(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var _f = useState(false), isAutoSubmitted = _f[0], setIsAutoSubmitted = _f[1];
    // Auto-submit when time runs out
    var handleAutoSubmit = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!isSubmitting && !isAutoSubmitted)) return [3 /*break*/, 4];
                    setIsAutoSubmitted(true);
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, onSubmit(answers)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Auto-submit failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [answers, onSubmit, isSubmitting, isAutoSubmitted]);
    // Timer countdown
    useEffect(function () {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }
        var timer = setInterval(function () {
            setTimeLeft(function (prev) {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return function () { return clearInterval(timer); };
    }, [timeLeft, handleAutoSubmit]);
    // Format time display
    var formatTime = function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(minutes.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
    };
    var handleAnswerChange = function (questionId, answer) {
        setAnswers(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = answer, _a)));
        });
    };
    var handleManualSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSubmitting)
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, onSubmit(answers)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Manual submit failed:', error_2);
                    setIsSubmitting(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var isTimeWarning = timeLeft <= 300; // 5 minutes warning
    var isTimeCritical = timeLeft <= 60; // 1 minute critical
    if (isAutoSubmitted || isSubmitting) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAutoSubmitted ? 'Time\'s Up!' : 'Quiz Submitted'}
          </h2>
          <p className="text-gray-600">
            {isAutoSubmitted
                ? 'Your quiz has been automatically submitted.'
                : 'Your answers have been saved successfully.'}
          </p>
        </div>
      </div>);
    }
    var currentQ = quiz.questions[currentQuestion];
    return (<div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          
          {/* Timer */}
          <div className={"flex items-center space-x-2 px-4 py-2 rounded-lg ".concat(isTimeCritical
            ? 'bg-red-100 text-red-700 timer-warning'
            : isTimeWarning
                ? 'bg-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700')}>
            <Clock className="h-5 w-5"/>
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
            {isTimeWarning && (<AlertTriangle className="h-4 w-4"/>)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1}
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {currentQ.points} {currentQ.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQ.type === 'multiple-choice' && currentQ.options && (<div className="space-y-3">
                {currentQ.options.map(function (option, index) { return (<label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="radio" name={"question-".concat(currentQ.id)} value={option} checked={answers[currentQ.id] === option} onChange={function (e) { return handleAnswerChange(currentQ.id, e.target.value); }} className="mr-3 h-4 w-4 text-blue-600"/>
                    <span className="text-gray-800">{option}</span>
                  </label>); })}
              </div>)}

            {currentQ.type === 'true-false' && (<div className="space-y-3">
                {['True', 'False'].map(function (option) { return (<label key={option} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="radio" name={"question-".concat(currentQ.id)} value={option} checked={answers[currentQ.id] === option} onChange={function (e) { return handleAnswerChange(currentQ.id, e.target.value); }} className="mr-3 h-4 w-4 text-blue-600"/>
                    <span className="text-gray-800">{option}</span>
                  </label>); })}
              </div>)}

            {currentQ.type === 'short-answer' && (<textarea value={answers[currentQ.id] || ''} onChange={function (e) { return handleAnswerChange(currentQ.id, e.target.value); }} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} placeholder="Type your answer here..."/>)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={function () { return setCurrentQuestion(Math.max(0, currentQuestion - 1)); }} disabled={currentQuestion === 0} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestion < quiz.questions.length - 1 ? (<button onClick={function () { return setCurrentQuestion(currentQuestion + 1); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Next
              </button>) : (<button onClick={handleManualSubmit} disabled={isSubmitting} className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>)}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Question Overview</h3>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentQuestion(index); }} className={"w-8 h-8 rounded text-sm font-medium transition-colors ".concat(index === currentQuestion
                ? 'bg-blue-600 text-white'
                : answers[quiz.questions[index].id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300')}>
                {index + 1}
              </button>); })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Answered: {Object.keys(answers).length} / {quiz.questions.length}
          </p>
        </div>
      </div>
    </div>);
}

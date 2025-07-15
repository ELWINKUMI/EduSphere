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
import { useState } from 'react';
import QuizTaker from '@/components/quiz/QuizTaker';
// Demo quiz data
var demoQuiz = {
    id: 'demo-quiz-1',
    title: 'JavaScript Fundamentals Quiz',
    timeLimit: 10, // 10 minutes for demo
    questions: [
        {
            id: 'q1',
            question: 'What is the correct way to declare a variable in JavaScript?',
            type: 'multiple-choice',
            options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
            points: 2
        },
        {
            id: 'q2',
            question: 'JavaScript is a compiled language.',
            type: 'true-false',
            points: 1
        },
        {
            id: 'q3',
            question: 'Explain the difference between let and var in JavaScript.',
            type: 'short-answer',
            points: 3
        },
        {
            id: 'q4',
            question: 'Which of the following are primitive data types in JavaScript? (Select all that apply)',
            type: 'multiple-choice',
            options: ['string', 'number', 'object', 'boolean', 'array'],
            points: 2
        },
        {
            id: 'q5',
            question: 'Arrays in JavaScript are zero-indexed.',
            type: 'true-false',
            points: 1
        }
    ]
};
export default function DemoQuizPage() {
    var _this = this;
    var _a = useState(false), quizStarted = _a[0], setQuizStarted = _a[1];
    var _b = useState(false), quizCompleted = _b[0], setQuizCompleted = _b[1];
    var _c = useState(null), results = _c[0], setResults = _c[1];
    var handleQuizSubmit = function (answers) { return __awaiter(_this, void 0, void 0, function () {
        var mockResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simulate API call
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })
                    // Mock results
                ];
                case 1:
                    // Simulate API call
                    _a.sent();
                    mockResults = {
                        score: 7,
                        totalPoints: 9,
                        percentage: 78,
                        timeSpent: 8.5
                    };
                    setResults(mockResults);
                    setQuizCompleted(true);
                    return [2 /*return*/];
            }
        });
    }); };
    if (quizCompleted) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Great job! Here are your results:</p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className="font-semibold">{results.score}/{results.totalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-semibold">{results.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Spent:</span>
              <span className="font-semibold">{results.timeSpent} minutes</span>
            </div>
          </div>
          
          <button onClick={function () {
                setQuizStarted(false);
                setQuizCompleted(false);
                setResults(null);
            }} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Take Quiz Again
          </button>
        </div>
      </div>);
    }
    if (quizStarted) {
        return <QuizTaker quiz={demoQuiz} onSubmit={handleQuizSubmit}/>;
    }
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="mb-6">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{demoQuiz.title}</h2>
          <p className="text-gray-600 mb-4">
            Test your JavaScript knowledge with this quick quiz.
          </p>
        </div>
        
        <div className="space-y-3 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Questions:</span>
            <span className="font-semibold">{demoQuiz.questions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Limit:</span>
            <span className="font-semibold">{demoQuiz.timeLimit} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Points:</span>
            <span className="font-semibold">
              {demoQuiz.questions.reduce(function (sum, q) { return sum + q.points; }, 0)}
            </span>
          </div>
        </div>
        
        <button onClick={function () { return setQuizStarted(true); }} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium">
          Start Quiz
        </button>
        
        <p className="text-xs text-gray-500 mt-4">
          Make sure you have a stable internet connection before starting.
        </p>
      </div>
    </div>);
}

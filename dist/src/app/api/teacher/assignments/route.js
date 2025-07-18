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
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import Submission from '@/models/Submission';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var token, decoded, teacher, assignments, assignmentsWithCounts, error_1;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    token = (_a = request.headers.get('authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ error: 'No token provided' }, { status: 401 })];
                    }
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    teacher = _b.sent();
                    if (!teacher || teacher.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Assignment.find({ teacher: teacher._id })
                            .populate('course', 'title subject gradeLevel')
                            .sort({ createdAt: -1 })
                            .lean()
                        // Get submission counts for each assignment
                    ];
                case 3:
                    assignments = _b.sent();
                    return [4 /*yield*/, Promise.all(assignments.map(function (assignment) { return __awaiter(_this, void 0, void 0, function () {
                            var submissionCount;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Submission.countDocuments({
                                            assignment: assignment._id
                                        })];
                                    case 1:
                                        submissionCount = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, assignment), { submissionCount: submissionCount })];
                                }
                            });
                        }); }))];
                case 4:
                    assignmentsWithCounts = _b.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            assignments: assignmentsWithCounts
                        })];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error fetching teacher assignments:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}

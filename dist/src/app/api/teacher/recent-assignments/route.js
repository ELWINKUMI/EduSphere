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
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, assignments, formattedAssignments, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, connectDB()
                        // Get token from authorization header
                    ];
                case 1:
                    _a.sent();
                    authHeader = request.headers.get('authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ error: 'Authorization token required' }, { status: 401 })];
                    }
                    token = authHeader.substring(7);
                    decoded = void 0;
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                    }
                    catch (error) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, Assignment.find({
                            teacher: new mongoose.Types.ObjectId(decoded.userId)
                        })
                            .populate('course', 'title')
                            .sort({ createdAt: -1 })
                            .limit(5)
                            .lean()
                        // Format assignments for display
                    ];
                case 2:
                    assignments = _a.sent();
                    formattedAssignments = assignments.map(function (assignment) {
                        var _a, _b;
                        var dueDate = new Date(assignment.dueDate);
                        var now = new Date();
                        var diffTime = dueDate.getTime() - now.getTime();
                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        var dueDateText = '';
                        if (diffDays < 0) {
                            dueDateText = "".concat(Math.abs(diffDays), " days overdue");
                        }
                        else if (diffDays === 0) {
                            dueDateText = 'Due today';
                        }
                        else if (diffDays === 1) {
                            dueDateText = 'Due tomorrow';
                        }
                        else {
                            dueDateText = "Due in ".concat(diffDays, " days");
                        }
                        return {
                            id: assignment._id,
                            title: assignment.title,
                            course: ((_a = assignment.course) === null || _a === void 0 ? void 0 : _a.title) || 'Unknown Course',
                            due: dueDateText,
                            submissions: ((_b = assignment.submissions) === null || _b === void 0 ? void 0 : _b.length) || 0
                        };
                    });
                    return [2 /*return*/, NextResponse.json({
                            assignments: formattedAssignments
                        })];
                case 3:
                    error_1 = _a.sent();
                    console.error('Get recent assignments error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}

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
import Course from '@/models/Course';
import User from '@/models/User';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, decoded, user, deleteResult, coursesWithoutCodes, updateCount, _i, coursesWithoutCodes_1, course, enrollmentCode, isUnique, attempts, existing, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, connectDB()
                        // Get the authorization token
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
                    return [4 /*yield*/, User.findById(decoded.userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ error: 'Unauthorized' }, { status: 403 })];
                    }
                    return [4 /*yield*/, Course.deleteMany({
                            $or: [
                                { enrollmentCode: null },
                                { enrollmentCode: undefined },
                                { enrollmentCode: '' }
                            ]
                        })
                        // Update courses without enrollment codes
                    ];
                case 3:
                    deleteResult = _a.sent();
                    return [4 /*yield*/, Course.find({
                            $or: [
                                { enrollmentCode: { $exists: false } },
                                { enrollmentCode: null },
                                { enrollmentCode: '' }
                            ]
                        })];
                case 4:
                    coursesWithoutCodes = _a.sent();
                    updateCount = 0;
                    _i = 0, coursesWithoutCodes_1 = coursesWithoutCodes;
                    _a.label = 5;
                case 5:
                    if (!(_i < coursesWithoutCodes_1.length)) return [3 /*break*/, 11];
                    course = coursesWithoutCodes_1[_i];
                    enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    isUnique = false;
                    attempts = 0;
                    _a.label = 6;
                case 6:
                    if (!(!isUnique && attempts < 10)) return [3 /*break*/, 8];
                    return [4 /*yield*/, Course.findOne({ enrollmentCode: enrollmentCode })];
                case 7:
                    existing = _a.sent();
                    if (!existing) {
                        isUnique = true;
                    }
                    else {
                        enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        attempts++;
                    }
                    return [3 /*break*/, 6];
                case 8:
                    if (!isUnique) return [3 /*break*/, 10];
                    return [4 /*yield*/, Course.findByIdAndUpdate(course._id, { enrollmentCode: enrollmentCode })];
                case 9:
                    _a.sent();
                    updateCount++;
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11: return [2 /*return*/, NextResponse.json({
                        message: 'Database cleanup completed',
                        deleted: deleteResult.deletedCount,
                        updated: updateCount
                    })];
                case 12:
                    error_1 = _a.sent();
                    console.error('Database cleanup error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })];
                case 13: return [2 /*return*/];
            }
        });
    });
}

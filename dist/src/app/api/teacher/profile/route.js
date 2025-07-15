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
import User from '@/models/User';
import jwt from 'jsonwebtoken';
// GET: Return teacher profile
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var token, auth, userId, decoded, user, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    token = '';
                    auth = request.headers.get('authorization');
                    if (auth && auth.startsWith('Bearer ')) {
                        token = auth.replace('Bearer ', '');
                    }
                    else if (request.cookies.has('token')) {
                        token = ((_a = request.cookies.get('token')) === null || _a === void 0 ? void 0 : _a.value) || '';
                    }
                    if (!token) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    userId = '';
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                        userId = decoded.userId;
                    }
                    catch (_c) {
                        return [2 /*return*/, NextResponse.json({ message: 'Invalid token' }, { status: 401 })];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, User.findById(userId)];
                case 3:
                    user = _b.sent();
                    if (!user || user.role !== 'teacher') {
                        return [2 /*return*/, NextResponse.json({ message: 'Not found or not a teacher.' }, { status: 404 })];
                    }
                    return [2 /*return*/, NextResponse.json({
                            name: user.name,
                            email: user.email,
                        })];
                case 4:
                    e_1 = _b.sent();
                    return [2 /*return*/, NextResponse.json({ message: 'Failed to fetch profile.' }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// PUT: Update teacher profile
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, token, userId, decoded, _a, name, email, user, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    auth = request.headers.get('authorization');
                    if (!auth || !auth.startsWith('Bearer ')) {
                        return [2 /*return*/, NextResponse.json({ message: 'Unauthorized' }, { status: 401 })];
                    }
                    token = auth.replace('Bearer ', '');
                    userId = '';
                    try {
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                        userId = decoded.userId;
                    }
                    catch (_c) {
                        return [2 /*return*/, NextResponse.json({ message: 'Invalid token' }, { status: 401 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 2:
                    _a = _b.sent(), name = _a.name, email = _a.email;
                    if (!name || !email) {
                        return [2 /*return*/, NextResponse.json({ message: 'Name and email are required.' }, { status: 400 })];
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, User.findById(userId)];
                case 4:
                    user = _b.sent();
                    if (!user || user.role !== 'teacher')
                        return [2 /*return*/, NextResponse.json({ message: 'User not found or not a teacher.' }, { status: 404 })];
                    user.name = name;
                    user.email = email;
                    return [4 /*yield*/, user.save()];
                case 5:
                    _b.sent();
                    return [2 /*return*/, NextResponse.json({ message: 'Profile updated.' })];
                case 6:
                    e_2 = _b.sent();
                    return [2 /*return*/, NextResponse.json({ message: 'Failed to update profile.' }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}

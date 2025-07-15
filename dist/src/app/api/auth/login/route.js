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
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userId, pin, user, tempToken, token, userData, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, connectDB()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, request.json()];
                case 2:
                    _a = _b.sent(), userId = _a.userId, pin = _a.pin;
                    console.log('[LOGIN DEBUG] Received:', { userId: userId, pin: pin });
                    // Validate input
                    if (!userId || !pin) {
                        console.log('[LOGIN DEBUG] Missing userId or pin');
                        return [2 /*return*/, NextResponse.json({ error: 'Login ID and PIN are required' }, { status: 400 })];
                    }
                    // Validate PIN format
                    if (!/^[0-9]{5}$/.test(pin)) {
                        console.log('[LOGIN DEBUG] Invalid PIN format:', pin);
                        return [2 /*return*/, NextResponse.json({ error: 'PIN must be exactly 5 digits' }, { status: 400 })];
                    }
                    return [4 /*yield*/, User.findOne({ userId: userId.trim(), pin: pin })];
                case 3:
                    user = _b.sent();
                    console.log('[LOGIN DEBUG] Found user:', user ? { _id: user._id, userId: user.userId, pin: user.pin, role: user.role } : null);
                    if (!user) {
                        console.log('[LOGIN DEBUG] No user found for', { userId: userId.trim(), pin: pin });
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid Login ID or PIN' }, { status: 401 })];
                    }
                    // If student and firstLogin, require pin change
                    if (user.role === 'student' && user.firstLogin) {
                        tempToken = jwt.sign({ userId: user._id, name: user.name, role: user.role, firstLogin: true }, process.env.JWT_SECRET, { expiresIn: '30m' });
                        return [2 /*return*/, NextResponse.json({
                                message: 'First login, PIN change required',
                                firstLogin: true,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    role: user.role,
                                    avatar: user.avatar,
                                    gradeLevel: user.gradeLevel,
                                },
                                token: tempToken
                            })];
                    }
                    token = jwt.sign({ userId: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    userData = {
                        id: user._id,
                        name: user.name,
                        role: user.role,
                        avatar: user.avatar,
                        gradeLevel: user.gradeLevel, // For students
                        subjects: user.subjects, // For teachers
                        grades: user.grades // For teachers
                    };
                    return [2 /*return*/, NextResponse.json({
                            message: 'Login successful',
                            user: userData,
                            token: token
                        })];
                case 4:
                    error_1 = _b.sent();
                    console.error('Login error:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}

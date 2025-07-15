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
import { sendPasswordResetEmail } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var email, user, resetToken, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbConnect()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, req.json()];
                case 3:
                    email = (_a.sent()).email;
                    if (!email || typeof email !== 'string') {
                        return [2 /*return*/, NextResponse.json({ message: 'Email is required.' }, { status: 400 })];
                    }
                    return [4 /*yield*/, User.findOne({ email: email })];
                case 4:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, NextResponse.json({ message: 'No user found with that email.' }, { status: 404 })];
                    }
                    resetToken = Math.random().toString(36).slice(2) + Date.now();
                    user.resetPasswordToken = resetToken;
                    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
                    return [4 /*yield*/, user.save()];
                case 5:
                    _a.sent();
                    // Send email (implement sendPasswordResetEmail in lib/auth)
                    return [4 /*yield*/, sendPasswordResetEmail(user.email, resetToken)];
                case 6:
                    // Send email (implement sendPasswordResetEmail in lib/auth)
                    _a.sent();
                    return [2 /*return*/, NextResponse.json({ message: 'Password reset email sent.' })];
                case 7:
                    error_1 = _a.sent();
                    return [2 /*return*/, NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}

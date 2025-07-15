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
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
export default function LoginPage() {
    var _this = this;
    var _a = useState(''), userId = _a[0], setUserId = _a[1];
    var _b = useState(''), pin = _b[0], setPin = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var login = useAuth().login;
    // Change PIN modal state
    var _d = useState(false), showChangePin = _d[0], setShowChangePin = _d[1];
    var _e = useState('verify'), changePinStep = _e[0], setChangePinStep = _e[1];
    var _f = useState(''), changePinName = _f[0], setChangePinName = _f[1];
    var _g = useState(''), oldPin = _g[0], setOldPin = _g[1];
    var _h = useState(''), newPin = _h[0], setNewPin = _h[1];
    var _j = useState(''), confirmNewPin = _j[0], setConfirmNewPin = _j[1];
    var _k = useState(false), changePinLoading = _k[0], setChangePinLoading = _k[1];
    var _l = useState(''), changePinError = _l[0], setChangePinError = _l[1];
    var _m = useState(''), changePinSuccess = _m[0], setChangePinSuccess = _m[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var success, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!userId || !pin) {
                        toast.error('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    if (userId.length !== 8 || !/^[0-9]{8}$/.test(userId)) {
                        toast.error('Login ID must be exactly 8 digits');
                        return [2 /*return*/];
                    }
                    if (pin.length !== 5 || !/^[0-9]{5}$/.test(pin)) {
                        toast.error('PIN must be exactly 5 digits');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, login(userId, pin)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        toast.success('Login successful!');
                    }
                    else {
                        toast.error('Invalid ID or PIN');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    toast.error('Login failed. Please try again.');
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border dark:border-gray-800 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-3 rounded-full shadow-lg">
              <BookOpen className="h-8 w-8 text-white drop-shadow"/>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">EduSphere Login</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1">Sign in with your Login ID and PIN</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input type="text" id="userId" label="8-Digit Login ID" value={userId} onChange={function (e) { return setUserId(e.target.value); }} placeholder="Enter your 8-digit Login ID" maxLength={8} pattern="[0-9]{8}" required/>
          <Input type="password" id="pin" label="5-Digit PIN" value={pin} onChange={function (e) { return setPin(e.target.value); }} placeholder="Enter your 5-digit PIN" maxLength={5} pattern="[0-9]{5}" required autoComplete="off"/>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow">
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-blue-400 rounded-full inline-block"></span> : null}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col gap-2">
          <button type="button" className="w-full py-2 px-4 rounded-lg bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 transition-colors shadow" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
            var res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userId || userId.length !== 8 || !/^[0-9]{8}$/.test(userId)) {
                            toast.error('Please enter your 8-digit Login ID above first.');
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch('/api/auth/forgot-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: userId }),
                            })];
                    case 2:
                        res = _b.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        toast.success('If your account exists, a password reset link has been sent to your registered email.');
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, res.json().catch(function () { return ({}); })];
                    case 4:
                        data = _b.sent();
                        toast.error(data.message || 'Failed to send password reset email.');
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a = _b.sent();
                        toast.error('Failed to send password reset email. Please try again.');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); }}>
            Forgot PIN?
          </button>
          <button type="button" className="w-full py-2 px-4 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition-colors shadow" onClick={function () {
            setShowChangePin(true);
            setChangePinStep('verify');
            setChangePinName('');
            setOldPin('');
            setNewPin('');
            setConfirmNewPin('');
            setChangePinError('');
            setChangePinSuccess('');
        }}>
            Change PIN
          </button>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Need help? Contact your teacher for your login credentials.
          </p>
          <Link href="/" className="text-sm text-blue-600 hover:underline mt-4 block">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>

    {/* Change PIN Modal */}
    <Modal open={showChangePin} onClose={function () { return setShowChangePin(false); }} title="Change PIN">
      {changePinSuccess ? (<div className="text-green-600 text-center font-semibold py-4">{changePinSuccess}</div>) : (<form onSubmit={function (e) { return __awaiter(_this, void 0, void 0, function () {
                var res, _a, res, data, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            e.preventDefault();
                            setChangePinError('');
                            if (!(changePinStep === 'verify')) return [3 /*break*/, 6];
                            if (!changePinName || !oldPin) {
                                setChangePinError('Please enter your name and old PIN.');
                                return [2 /*return*/];
                            }
                            if (oldPin.length !== 5 || !/^[0-9]{5}$/.test(oldPin)) {
                                setChangePinError('PIN must be exactly 5 digits.');
                                return [2 /*return*/];
                            }
                            setChangePinLoading(true);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, fetch('/api/auth/login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name: changePinName, pin: oldPin }),
                                })];
                        case 2:
                            res = _c.sent();
                            if (res.ok) {
                                setChangePinStep('set');
                            }
                            else {
                                setChangePinError('Invalid name or old PIN.');
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            _a = _c.sent();
                            setChangePinError('Failed to verify credentials.');
                            return [3 /*break*/, 5];
                        case 4:
                            setChangePinLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [3 /*break*/, 14];
                        case 6:
                            if (!(changePinStep === 'set')) return [3 /*break*/, 14];
                            if (!newPin || !confirmNewPin) {
                                setChangePinError('Please enter and confirm your new PIN.');
                                return [2 /*return*/];
                            }
                            if (newPin.length !== 5 || !/^[0-9]{5}$/.test(newPin)) {
                                setChangePinError('New PIN must be exactly 5 digits.');
                                return [2 /*return*/];
                            }
                            if (newPin !== confirmNewPin) {
                                setChangePinError('PINs do not match.');
                                return [2 /*return*/];
                            }
                            setChangePinLoading(true);
                            _c.label = 7;
                        case 7:
                            _c.trys.push([7, 12, 13, 14]);
                            return [4 /*yield*/, fetch('/api/auth/change-pin', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name: changePinName, oldPin: oldPin, newPin: newPin }),
                                })];
                        case 8:
                            res = _c.sent();
                            if (!res.ok) return [3 /*break*/, 9];
                            setChangePinSuccess('PIN changed successfully. You can now log in with your new PIN.');
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, res.json()];
                        case 10:
                            data = _c.sent();
                            setChangePinError(data.message || 'Failed to change PIN.');
                            _c.label = 11;
                        case 11: return [3 /*break*/, 14];
                        case 12:
                            _b = _c.sent();
                            setChangePinError('Failed to change PIN.');
                            return [3 /*break*/, 14];
                        case 13:
                            setChangePinLoading(false);
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            }); }} className="flex flex-col gap-4">
          {changePinStep === 'verify' && (<>
              <Input type="text" label="Full Name" value={changePinName} onChange={function (e) { return setChangePinName(e.target.value); }} placeholder="Enter your full name" required/>
              <Input type="text" label="Old PIN" value={oldPin} onChange={function (e) { return setOldPin(e.target.value); }} placeholder="Enter your old 5-digit PIN" maxLength={5} pattern="[0-9]{5}" required/>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={changePinLoading}>
                {changePinLoading ? 'Verifying...' : 'Verify'}
              </button>
            </>)}
          {changePinStep === 'set' && (<>
              <Input type="text" label="New PIN" value={newPin} onChange={function (e) { return setNewPin(e.target.value); }} placeholder="Enter new 5-digit PIN" maxLength={5} pattern="[0-9]{5}" required/>
              <Input type="text" label="Confirm New PIN" value={confirmNewPin} onChange={function (e) { return setConfirmNewPin(e.target.value); }} placeholder="Confirm new 5-digit PIN" maxLength={5} pattern="[0-9]{5}" required/>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={changePinLoading}>
                {changePinLoading ? 'Changing PIN...' : 'Change PIN'}
              </button>
            </>)}
          {changePinError && <div className="text-red-600 text-sm font-medium text-center">{changePinError}</div>}
        </form>)}
    </Modal>
    </>);
}

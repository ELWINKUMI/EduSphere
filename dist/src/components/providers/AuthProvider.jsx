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
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
var AuthContext = createContext(null);
export function AuthProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), showInactivityModal = _d[0], setShowInactivityModal = _d[1];
    var inactivityTimeoutId = useRef(null);
    var modalTimeoutId = useRef(null);
    var router = useRouter();
    // Inactivity modal and timer helpers must be defined before use
    var hasLoggedOut = false;
    var handleLogout = function () {
        if (!hasLoggedOut) {
            hasLoggedOut = true;
            setShowInactivityModal(false);
            logout();
        }
    };
    var showModal = function () {
        hasLoggedOut = false; // Reset so handleLogout works for every modal open
        setShowInactivityModal(true);
        // Start modal timer (60 seconds for production)
        if (modalTimeoutId.current)
            clearTimeout(modalTimeoutId.current);
        modalTimeoutId.current = setTimeout(function () {
            handleLogout();
        }, 60000);
    };
    var resetTimer = function () {
        if (inactivityTimeoutId.current)
            clearTimeout(inactivityTimeoutId.current);
        if (modalTimeoutId.current)
            clearTimeout(modalTimeoutId.current);
        setShowInactivityModal(false);
        if (user) {
            inactivityTimeoutId.current = setTimeout(showModal, 300000); // 5 minutes for production
        }
    };
    // Inactivity logout timer (5 minutes = 300000 ms)
    useEffect(function () {
        checkAuth();
        var activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
        activityEvents.forEach(function (event) { return window.addEventListener(event, resetTimer); });
        // If user becomes null (logged out), clear timers
        if (!user) {
            if (inactivityTimeoutId.current)
                clearTimeout(inactivityTimeoutId.current);
            if (modalTimeoutId.current)
                clearTimeout(modalTimeoutId.current);
            setShowInactivityModal(false);
            hasLoggedOut = false;
        }
        return function () {
            if (inactivityTimeoutId.current)
                clearTimeout(inactivityTimeoutId.current);
            if (modalTimeoutId.current)
                clearTimeout(modalTimeoutId.current);
            activityEvents.forEach(function (event) { return window.removeEventListener(event, resetTimer); });
            setShowInactivityModal(false);
            hasLoggedOut = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    // Start inactivity timer immediately when user is set
    useEffect(function () {
        if (user) {
            resetTimer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    var checkAuth = function () { return __awaiter(_this, void 0, void 0, function () {
        var token, response, text, userData_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, 8, 9]);
                    token = localStorage.getItem('token');
                    if (!token) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch('/api/auth/verify', {
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    if (text) {
                        try {
                            userData_1 = JSON.parse(text);
                            setUser(function (prev) {
                                if (!prev || JSON.stringify(prev) !== JSON.stringify(userData_1.user)) {
                                    return userData_1.user;
                                }
                                return prev;
                            });
                        }
                        catch (parseError) {
                            console.error('Failed to parse auth response:', parseError);
                            localStorage.removeItem('token');
                            setUser(null);
                        }
                    }
                    else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    localStorage.removeItem('token');
                    setUser(null);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    setUser(null);
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_1 = _a.sent();
                    console.error('Auth check failed:', error_1);
                    localStorage.removeItem('token');
                    setUser(null);
                    return [3 /*break*/, 9];
                case 8:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var login = function (userId, pin) { return __awaiter(_this, void 0, void 0, function () {
        var response, text, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId: userId, pin: pin })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    if (text) {
                        try {
                            data = JSON.parse(text);
                            localStorage.setItem('token', data.token);
                            setUser(data.user);
                            router.push("/".concat(data.user.role, "/dashboard"));
                            return [2 /*return*/, true];
                        }
                        catch (parseError) {
                            console.error('Failed to parse login response:', parseError);
                            return [2 /*return*/, false];
                        }
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, false];
                case 4:
                    error_2 = _a.sent();
                    console.error('Login failed:', error_2);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };
    // Expose a method to refresh user data (after profile update)
    var refreshUser = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkAuth()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<AuthContext.Provider value={{ user: user, loading: loading, login: login, logout: logout, refreshUser: refreshUser }}>
      {children}
      {showInactivityModal && (<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full text-center">
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Session Expiring</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">You have been inactive for a while.<br />Do you want to stay logged in?</p>
            <div className="flex gap-3 justify-center">
              <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={function () {
                if (modalTimeoutId.current)
                    clearTimeout(modalTimeoutId.current);
                setShowInactivityModal(false);
                // Reset inactivity timer
                if (inactivityTimeoutId.current)
                    clearTimeout(inactivityTimeoutId.current);
                inactivityTimeoutId.current = setTimeout(showModal, 300000);
            }}>
                Stay Logged In
              </button>
              <button className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400" onClick={function () {
                if (modalTimeoutId.current)
                    clearTimeout(modalTimeoutId.current);
                setShowInactivityModal(false);
                logout();
            }}>
                Log Out
              </button>
            </div>
          </div>
        </div>)}
    </AuthContext.Provider>);
}
export function useAuth() {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

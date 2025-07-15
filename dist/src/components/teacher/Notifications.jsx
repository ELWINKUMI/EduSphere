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
import React, { useEffect, useState } from "react";
import { Bell, Loader2, CheckCircle } from "lucide-react";
var POLL_INTERVAL = 10000; // 10 seconds
var Notifications = function () {
    var _a = useState([]), notifications = _a[0], setNotifications = _a[1];
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), marking = _d[0], setMarking = _d[1];
    var fetchNotifications = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 6]);
                    token = localStorage.getItem("token");
                    return [4 /*yield*/, fetch("/api/teacher/notifications", {
                            headers: { Authorization: "Bearer ".concat(token) },
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    setNotifications(data.notifications || []);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        if (open)
            fetchNotifications();
        var interval = setInterval(function () {
            if (open)
                fetchNotifications();
        }, POLL_INTERVAL);
        return function () { return clearInterval(interval); };
    }, [open]);
    var markAllRead = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setMarking(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    token = localStorage.getItem("token");
                    return [4 /*yield*/, fetch("/api/teacher/notifications", {
                            method: "PATCH",
                            headers: { Authorization: "Bearer ".concat(token) },
                        })];
                case 2:
                    _a.sent();
                    setNotifications([]);
                    return [3 /*break*/, 4];
                case 3:
                    setMarking(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="relative">
      <button className="p-2 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-gray-800 dark:to-blue-900 text-blue-600 dark:text-blue-300 shadow hover:scale-105 transition-transform relative" onClick={function () { return setOpen(function (v) { return !v; }); }} aria-label="Notifications">
        <Bell className="h-6 w-6"/>
        {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>)}
      </button>
      {open && (<div className="fixed left-0 right-0 top-16 w-screen sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-[9999] py-1 sm:py-2 max-h-80 overflow-y-auto box-border">
          <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">Notifications</span>
            <button className="text-xs text-blue-600 dark:text-blue-300 hover:underline disabled:opacity-60" onClick={markAllRead} disabled={marking || notifications.length === 0}>
              Mark all as read
            </button>
          </div>
          {loading ? (<div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500"/>
            </div>) : notifications.length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-8 w-8 mb-2 text-green-400"/>
              <span>No new notifications</span>
            </div>) : (<ul>
              {notifications.map(function (n) { return (<li key={n._id} className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex flex-col gap-1">
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium break-words whitespace-pre-line">{n.content}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </li>); })}
            </ul>)}
        </div>)}
    </div>);
};
export default Notifications;

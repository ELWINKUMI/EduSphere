"use client";
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
import { Calendar as CalendarIcon, FileText, PenTool } from "lucide-react";
import Link from "next/link";
// Simple calendar grid for demo (replace with a real calendar lib for production)
function getMonthDays(year, month) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}
export default function StudentCalendarPage() {
    var _a = useState([]), events = _a[0], setEvents = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(function () {
        var now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    }), currentMonth = _c[0], setCurrentMonth = _c[1];
    useEffect(function () {
        // Fetch assignments/quizzes for the student
        function fetchEvents() {
            return __awaiter(this, void 0, void 0, function () {
                var token, res, data, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setLoading(true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                            return [4 /*yield*/, fetch("/api/student/calendar", {
                                    headers: token ? { Authorization: "Bearer ".concat(token) } : {},
                                })];
                        case 2:
                            res = _b.sent();
                            if (!res.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, res.json()];
                        case 3:
                            data = _b.sent();
                            setEvents(data.events || []);
                            return [3 /*break*/, 5];
                        case 4:
                            setEvents([]);
                            _b.label = 5;
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            _a = _b.sent();
                            setEvents([]);
                            return [3 /*break*/, 8];
                        case 7:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
        fetchEvents();
    }, []);
    var days = getMonthDays(currentMonth.year, currentMonth.month);
    var monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString("default", { month: "long" });
    // Group events by date, guard against undefined/null dueDate
    var eventsByDate = {};
    for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
        var event_1 = events_1[_i];
        if (!(event_1 === null || event_1 === void 0 ? void 0 : event_1.dueDate))
            continue;
        var date = '';
        if (typeof event_1.dueDate === 'string') {
            date = event_1.dueDate;
        }
        else if (typeof event_1.dueDate === 'object' && event_1.dueDate !== null && typeof event_1.dueDate.toISOString === 'function') {
            date = event_1.dueDate.toISOString();
        }
        else {
            continue;
        }
        var dateKey = date.slice(0, 10); // YYYY-MM-DD
        if (!eventsByDate[dateKey])
            eventsByDate[dateKey] = [];
        eventsByDate[dateKey].push(event_1);
    }
    function prevMonth() {
        setCurrentMonth(function (prev) {
            var m = prev.month === 0 ? 11 : prev.month - 1;
            var y = prev.month === 0 ? prev.year - 1 : prev.year;
            return { year: y, month: m };
        });
    }
    function nextMonth() {
        setCurrentMonth(function (prev) {
            var m = prev.month === 11 ? 0 : prev.month + 1;
            var y = prev.month === 11 ? prev.year + 1 : prev.year;
            return { year: y, month: m };
        });
    }
    return (<div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <button onClick={function () { return window.location.href = '/student/dashboard'; }} className="mr-4 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
          <span className="mr-1">←</span> Back
        </button>
        <CalendarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3"/>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">{monthName} {currentMonth.year}</span>
          <button onClick={nextMonth} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs md:text-sm mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (d) { return (<div key={d} className="font-medium text-gray-500 dark:text-gray-400">{d}</div>); })}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Pad first week */}
          {Array(days[0].getDay()).fill(null).map(function (_, i) { return (<div key={"pad-" + i}></div>); })}
          {days.map(function (day) {
            var dateKey = day.toISOString().slice(0, 10);
            var dayEvents = eventsByDate[dateKey] || [];
            return (<div key={dateKey} className={"rounded-lg p-1 md:p-2 min-h-[48px] border ".concat(dayEvents.length ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-700')}>
                <div className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{day.getDate()}</div>
                {dayEvents.map(function (ev) { return (<Link key={ev._id} href={ev.link} className="block mt-1 text-xs md:text-sm rounded px-1 py-0.5 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 flex items-center gap-1">
                    {ev.type === 'assignment' ? <FileText className="h-3 w-3"/> : <PenTool className="h-3 w-3"/>}
                    <span className="truncate">{ev.title}</span>
                  </Link>); })}
              </div>);
        })}
        </div>
        {loading && <div className="text-center text-gray-500 dark:text-gray-400 mt-4">Loading events...</div>}
        {!loading && events.length === 0 && (<div className="text-center text-gray-500 dark:text-gray-400 mt-4">No assignments or quizzes this month.</div>)}
      </div>
    </div>);
}

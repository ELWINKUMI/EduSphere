
"use client";
import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, FileText, PenTool } from "lucide-react";
import { CalendarEvent } from "./CalendarEvent";
import Link from "next/link";

// Simple calendar grid for demo (replace with a real calendar lib for production)
function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function StudentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    // Fetch assignments/quizzes for the student
    async function fetchEvents() {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch("/api/student/calendar", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        } else {
          setEvents([]);
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const days = getMonthDays(currentMonth.year, currentMonth.month);
  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString("default", { month: "long" });

  // Group events by date, guard against undefined/null dueDate
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  for (const event of events) {
    if (!event?.dueDate) continue;
    let date: string = '';
    if (typeof event.dueDate === 'string') {
      date = event.dueDate;
    } else if (typeof event.dueDate === 'object' && event.dueDate !== null && typeof (event.dueDate as any).toISOString === 'function') {
      date = (event.dueDate as any).toISOString();
    } else {
      continue;
    }
    const dateKey = date.slice(0, 10); // YYYY-MM-DD
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(event);
  }

  function prevMonth() {
    setCurrentMonth((prev) => {
      const m = prev.month === 0 ? 11 : prev.month - 1;
      const y = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year: y, month: m };
    });
  }
  function nextMonth() {
    setCurrentMonth((prev) => {
      const m = prev.month === 11 ? 0 : prev.month + 1;
      const y = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year: y, month: m };
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.location.href = '/student/dashboard'}
          className="mr-4 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
        >
          <span className="mr-1">←</span> Back
        </button>
        <CalendarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
          <span className="font-semibold text-lg text-gray-900 dark:text-white">{monthName} {currentMonth.year}</span>
          <button onClick={nextMonth} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs md:text-sm mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="font-medium text-gray-500 dark:text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Pad first week */}
          {Array(days[0].getDay()).fill(null).map((_, i) => (
            <div key={"pad-"+i}></div>
          ))}
          {days.map((day) => {
            const dateKey = day.toISOString().slice(0,10);
            const dayEvents = eventsByDate[dateKey] || [];
            return (
              <div key={dateKey} className={`rounded-lg p-1 md:p-2 min-h-[48px] border ${dayEvents.length ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{day.getDate()}</div>
                {dayEvents.map((ev) => (
                  <Link key={ev._id} href={ev.link} className="block mt-1 text-xs md:text-sm rounded px-1 py-0.5 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 flex items-center gap-1">
                    {ev.type === 'assignment' ? <FileText className="h-3 w-3" /> : <PenTool className="h-3 w-3" />}
                    <span className="truncate">{ev.title}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
        {loading && <div className="text-center text-gray-500 dark:text-gray-400 mt-4">Loading events...</div>}
        {!loading && events.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">No assignments or quizzes this month.</div>
        )}
      </div>
    </div>
  );
}

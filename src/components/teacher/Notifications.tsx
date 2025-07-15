import React, { useEffect, useState } from "react";
import { Bell, Loader2, CheckCircle } from "lucide-react";

interface Notification {
  _id: string;
  type: string;
  studentName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

const POLL_INTERVAL = 10000; // 10 seconds

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teacher/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
    const interval = setInterval(() => {
      if (open) fetchNotifications();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [open]);

  const markAllRead = async () => {
    setMarking(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/teacher/notifications", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-gray-800 dark:to-blue-900 text-blue-600 dark:text-blue-300 shadow hover:scale-105 transition-transform relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </button>
      {open && (
        <div
          className="fixed left-0 right-0 top-16 w-screen sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-[9999] py-1 sm:py-2 max-h-80 overflow-y-auto box-border"
        >
          <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">Notifications</span>
            <button
              className="text-xs text-blue-600 dark:text-blue-300 hover:underline disabled:opacity-60"
              onClick={markAllRead}
              disabled={marking || notifications.length === 0}
            >
              Mark all as read
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-8 w-8 mb-2 text-green-400" />
              <span>No new notifications</span>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n._id} className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex flex-col gap-1">
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium break-words whitespace-pre-line">{n.content}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

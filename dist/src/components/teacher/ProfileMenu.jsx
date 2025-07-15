import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, Calendar, User, LogOut } from "lucide-react";
import Avatar from "../ui/Avatar";
var menuItems = [
    {
        label: "Profile",
        icon: <User className="h-4 w-4 mr-2"/>,
        href: "/teacher/profile",
    },
    {
        label: "Settings",
        icon: <Settings className="h-4 w-4 mr-2"/>,
        href: "/teacher/settings",
    },
    {
        label: "Calendar",
        icon: <Calendar className="h-4 w-4 mr-2"/>,
        href: "/teacher/calendar",
    },
];
var ProfileMenu = function (_a) {
    var name = _a.name, onLogout = _a.onLogout;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var ref = useRef(null);
    useEffect(function () {
        var handleClick = function (e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open)
            document.addEventListener("mousedown", handleClick);
        return function () { return document.removeEventListener("mousedown", handleClick); };
    }, [open]);
    return (<div className="relative" ref={ref}>
      <button className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={function () { return setOpen(function (v) { return !v; }); }} aria-label="Open profile menu">
        <Avatar name={name} size={40}/>
      </button>
      {open && (<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 py-2">
          {menuItems.map(function (item) { return (<Link key={item.label} href={item.href} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-sm" onClick={function () { return setOpen(false); }}>
              {item.icon}
              {item.label}
            </Link>); })}
          <button className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-sm" onClick={function () { setOpen(false); onLogout(); }}>
            <LogOut className="h-4 w-4 mr-2"/> Logout
          </button>
        </div>)}
    </div>);
};
export default ProfileMenu;

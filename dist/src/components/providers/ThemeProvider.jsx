'use client';
import { createContext, useContext, useState, useEffect } from 'react';
var ThemeContext = createContext(undefined);
export function ThemeProvider(_a) {
    var children = _a.children;
    var _b = useState(false), isDark = _b[0], setIsDark = _b[1];
    useEffect(function () {
        // Check localStorage for theme preference
        var saved = localStorage.getItem('theme');
        if (saved) {
            setIsDark(saved === 'dark');
        }
        else {
            // Check system preference
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);
    useEffect(function () {
        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    var toggleTheme = function () {
        setIsDark(function (prev) { return !prev; });
    };
    return (<ThemeContext.Provider value={{ isDark: isDark, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>);
}
export function useTheme() {
    var context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

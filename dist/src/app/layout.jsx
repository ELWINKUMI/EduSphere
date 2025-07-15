import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
var inter = Inter({ subsets: ['latin'] });
export var metadata = {
    title: 'EduSphere - Learning Management System',
    description: 'A comprehensive learning management system for schools and educational institutions',
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en" suppressHydrationWarning>
      <body className={"".concat(inter.className, " bg-white dark:bg-gray-900 transition-colors")}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right"/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>);
}

import React from 'react';
export default function Modal(_a) {
    var open = _a.open, onClose = _a.onClose, title = _a.title, children = _a.children;
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={onClose} aria-label="Close">
          ×
        </button>
        {title && <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>}
        {children}
      </div>
    </div>);
}

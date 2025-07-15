var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
export var Input = React.forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, _b = _a.className, className = _b === void 0 ? '' : _b, type = _a.type, props = __rest(_a, ["label", "error", "className", "type"]);
    var _c = useState(false), showPassword = _c[0], setShowPassword = _c[1];
    var isPasswordField = type === 'password';
    var inputType = isPasswordField && showPassword ? 'text' : type;
    return (<div className="w-full">
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>)}
        <div className="relative">
          <input ref={ref} type={inputType} className={"\n              w-full px-4 py-3 \n              ".concat(isPasswordField ? 'pr-12' : '', "\n              text-gray-900 dark:text-gray-100\n              bg-white dark:bg-gray-800\n              border border-gray-300 dark:border-gray-700\n              rounded-lg \n              placeholder-gray-400 dark:placeholder-gray-500\n              focus:ring-2 focus:ring-blue-500 focus:border-transparent\n              disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-500\n              ").concat(error ? 'border-red-500 focus:ring-red-500' : '', "\n              ").concat(className, "\n            ")} {...props}/>
          {isPasswordField && (<button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
            </button>)}
        </div>
        {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
      </div>);
});
Input.displayName = 'Input';
export var Textarea = React.forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "className"]);
    return (<div className="w-full">
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>)}
        <textarea ref={ref} className={"\n            w-full px-4 py-3 \n            text-gray-900 \n            bg-white \n            border border-gray-300 \n            rounded-lg \n            placeholder-gray-400\n            focus:ring-2 focus:ring-blue-500 focus:border-transparent\n            disabled:bg-gray-50 disabled:text-gray-500\n            resize-vertical\n            ".concat(error ? 'border-red-500 focus:ring-red-500' : '', "\n            ").concat(className, "\n          ")} {...props}/>
        {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
      </div>);
});
Textarea.displayName = 'Textarea';

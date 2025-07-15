import React from "react";
export var Avatar = function (_a) {
    var name = _a.name, _b = _a.size, size = _b === void 0 ? 40 : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var initials = name
        .split(" ")
        .map(function (n) { return n[0]; })
        .join("")
        .toUpperCase();
    return (<div className={"flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white font-bold shadow-lg ".concat(className)} style={{ width: size, height: size, fontSize: size * 0.45 }}>
      {initials}
    </div>);
};
export default Avatar;

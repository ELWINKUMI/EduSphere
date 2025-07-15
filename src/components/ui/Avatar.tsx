import React from "react";

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 40, className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white font-bold shadow-lg ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initials}
    </div>
  );
};

export default Avatar;

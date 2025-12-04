import React from "react";

export default function CustomLoader({ message = null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
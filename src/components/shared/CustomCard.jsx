import React from "react";

export default function CustomCard({ title = "", children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
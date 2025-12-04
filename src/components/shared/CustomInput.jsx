import React from "react";

export default function CustomInput({ placeholder = "Enter text...", value, onChange, label = "" }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-gray-300 rounded font-medium focus:border-blue-500 outline-none transition"
      />
    </div>
  );
}

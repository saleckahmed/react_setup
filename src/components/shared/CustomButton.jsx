import React from "react";

export default function CustomButton({ text = "Button", onClick, variant = "primary" }) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    };

    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-lg font-medium transition ${variants[variant]}`}
        >
            {text}
        </button>
    );
}
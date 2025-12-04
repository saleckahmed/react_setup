import React from "react";

export default function CustomFooter({ company = "MyProducts" }) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">&copy; 2025 {company}. All rights reserved.</p>
      </div>
    </footer>
  );
}
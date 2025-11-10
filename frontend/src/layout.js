// layout.js
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {children}
    </div>
  );
}

"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a24",
          color: "#f1f1f5",
          border: "1px solid #2e2e42",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#1a1a24" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#1a1a24" },
        },
      }}
    />
  );
}

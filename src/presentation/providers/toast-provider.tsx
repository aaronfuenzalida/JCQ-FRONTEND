"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid #2d2d2d",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          maxWidth: "500px",
          lineHeight: "1.5",
          whiteSpace: "pre-line",
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #10b981",
          },
        },
        // Error
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #ef4444",
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: "#ff6b35",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #ff6b35",
          },
        },
      }}
    />
  );
}

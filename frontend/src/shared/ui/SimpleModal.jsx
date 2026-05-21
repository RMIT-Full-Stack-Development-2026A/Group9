import React from "react";

/*
  SimpleModal
  - Minimal, styled modal component used across the app for dialogs and
    transient content. It intentionally avoids external dependencies and
    provides a straightforward overlay + centered panel.
*/
export default function SimpleModal({ open, onClose, children }) {
  // Do not render any DOM when modal is closed
  if (!open) return null;

  return (
    // Overlay: dark translucent full-viewport backdrop
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.7)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/*
        Modal panel: centered container with visual styling. Keep markup
        minimal so callers can control layout within `children`.
      */}
      <div style={{
        background: "#101828",
        borderRadius: 16,
        padding: 32,
        minWidth: 400,
        maxWidth: "90vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        position: "relative"
      }}>
        {/* Close button: visible in the top-right corner. Consumers should
            pass an `onClose` handler that updates the `open` prop. */}
        <button onClick={onClose} style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer"
        }}>&times;</button>

        {/* Render caller-provided content */}
        {children}
      </div>
    </div>
  );
}

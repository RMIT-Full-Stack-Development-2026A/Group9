import React from "react";

export default function SimpleModal({ open, onClose, children }) {
  if (!open) return null;
  return (
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
      <div style={{
        background: "#101828",
        borderRadius: 16,
        padding: 32,
        minWidth: 400,
        maxWidth: "90vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        position: "relative"
      }}>
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
        {children}
      </div>
    </div>
  );
}

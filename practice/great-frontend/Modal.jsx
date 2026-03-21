import { useState } from "react";

const modalClass = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "500px" /* Responsive limit */,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)" /* Centers the box */,
  //boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
};

const modalOverlay = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  //zIndex: "1000",
};

export default function ModalDialog({ children, title, open, onClose }) {
  return (
    <>
      {open && (
        <div style={modalOverlay}>
          <div style={modalClass}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h1>{title}</h1>
              <span onClick={onClose}>x</span>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

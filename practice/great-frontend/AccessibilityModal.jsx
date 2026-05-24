import { useEffect, useRef } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    modalRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={closeButtonStyle}
        >
          X
        </button>

        <h2 id="modal-title">{title}</h2>
        <p id="modal-description">{description}</p>

        <div>{children}</div>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={onClose}>Cancel</button>
          <button style={{ marginLeft: "8px" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "500px",
  border: "1px solid grey",
  position: "relative",
  outline: "none",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
};



import { useEffect, useRef, useState } from "react";

function Modal1({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;

    const modal = modalRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const getFocusable = () =>
      Array.from(modal.querySelectorAll(focusableSelectors));

    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) {
      first.focus();
    } else {
      modal.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const items = getFocusable();
        if (items.length === 0) {
          event.preventDefault();
          return;
        }

        const firstItem = items[0];
        const lastItem = items[items.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstItem || document.activeElement === modal) {
            event.preventDefault();
            lastItem.focus();
          }
        } else {
          if (document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          style={closeButtonStyle}
        >
          X
        </button>

        <h2 id="modal-title">{title}</h2>

        <div>{children}</div>

        <div style={footerStyle}>
          <button onClick={onClose}>Cancel</button>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef(null);

  return (
    <div style={{ padding: "2rem" }}>
      <button ref={openButtonRef} onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete item?"
      >
        <p>This action cannot be undone.</p>
        <input placeholder="Type here" />
      </Modal>
    </div>
  );
}

// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   background: "#fff",
//   width: "90%",
//   maxWidth: "500px",
//   borderRadius: "8px",
//   padding: "1.5rem",
//   position: "relative",
//   outline: "none",
// };

// const closeButtonStyle = {
//   position: "absolute",
//   top: "12px",
//   right: "12px",
// };

// const footerStyle = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "8px",
//   marginTop: "1rem",
// };

import { useState, useEffect } from "react";

export default function Clock() {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const [state, setState] = useState(
    new Date().toLocaleTimeString("en-GB", options),
  );

  setInterval(
    () => setState(new Date().toLocaleTimeString("en-GB", options)),
    1000,
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        color: "white",
        // fontSize: "14px",
      }}
    >
      <div
        style={{
          fontSize: "5rem",
          border: "8px solid grey",
          borderRadius: "5px",
          backgroundColor: "black",
          padding: "1rem",
        }}
      >
        {state}
      </div>
    </div>
  );
}

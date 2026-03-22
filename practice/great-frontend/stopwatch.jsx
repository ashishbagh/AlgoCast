import { useState, useEffect } from "react";

export default function Stopwatch() {
  const [state, setState] = useState(0);

  const [isRunning, setIsRunnning] = useState(false);

  useEffect(() => {
    let id;
    if (isRunning) {
      id = setInterval(() => setState((t) => t + 10), 10);
    }
    return () => clearInterval(id);
  }, [isRunning]);

  const format = (time) => {
    const sec = Math.floor(time / 1000)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor((time % 1000) / 10)
      .toString()
      .padStart(2, "0");

    return `${sec}s ${ms}ms`;
  };

  return (
    <div>
      <p>{format(state)}</p>
      <div>
        <button onClick={() => setIsRunnning(true)}>Start</button>{" "}
        <button
          onClick={() => {
            setIsRunnning(false);
            setState(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

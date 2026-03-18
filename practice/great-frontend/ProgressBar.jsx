import { useState } from "react";

export default function ProgressBar() {
  let [progress, setProgress] = useState(10);

  handleClick = () => {
    if (progress < 100) {
      setTimeout(() => setProgress(progress + 10), 500); // simulate loading
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", width: "100%", marginBottom: "10px" }}
        className="progress"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: `${progress}%`,
            color: "white",
            backgroundColor: "#0d6efd",
            alignItems: "center",
            fontSize: "10px",
            borderRadius: "7px",
            transition: "width 0.3s ease-in-out",
            animation: "loading 1.5s infinite",
          }}
        >
          {`${progress}%`}
        </div>
        <div
          style={{
            width: `${100 - progress}%`,
          }}
        />
      </div>
      <button onClick={handleClick}>Increase</button>
    </>
  );
}

import { useRef } from "react";

export default function AuthCodeInput({
  onSubmit,
}: Readonly<{
  onSubmit: () => void;
}>) {
  const inputsRef = useRef([]);

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !inputsRef.current[index].value &&
      index > 0
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleChange = (e, index) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  //
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        {[0, 1, 2, 3, 4].map((_, index) => (
          <input
            key={index}
            maxLength={1}
            ref={(el) => (inputsRef.current[index] = el)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onChange={(e) => handleChange(e, index)}
            style={{ width: "40px", margin: "5px", textAlign: "center" }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button type="reset">Reset</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

import { useState } from "react";

export default function StarRating({ maxStar = 5, curr = 1 }) {
  const arr = Array.from({ length: maxStar }, (_, i) => i < curr);

  const [starSt, setStarSt] = useState([...arr]);
  const [tempState, setTempState] = useState([...arr]);

  const onHover = (event) => {
    if (!event.target.id) return;
    const id = event.target.id;
    let temp = [...starSt];
    document.getElementById(id).classList.add("star-icon-filled");
    temp = [...temp.map((_, i) => i <= id)];
    setTimeout(() => setStarSt(temp), 10);
  };

  const onOut = (event) => {
    if (!event.target.id) return;
    setStarSt(tempState);
  };

  const click = (event) => {
    const id = event.target.id;
    const newState = [...starSt.map((_, i) => i <= id)];
    setStarSt(newState);
    setTempState(newState);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`star-icon ${starSt[index] ? "star-icon-filled" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            id={index}
            key={index}
            strokeWidth="2"
            onMouseEnter={onHover}
            onMouseOut={onOut}
            onClick={click}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      })}
    </div>
  );
}





export default function StarRatings({ maxStar = 5, curr = 1 }) {
  const [selected, setSelected] = useState(curr - 1); // 0-based index
  const [hovered, setHovered] = useState(null);        // null = not hovering

  // hover preview overrides the persisted selection
  const filledUpTo = hovered !== null ? hovered : selected;

  return (
    <div role="radiogroup" aria-label="Star rating">
      {Array.from({ length: maxStar }, (_, index) => (
        <svg
          key={index}
          role="radio"
          aria-checked={index === selected}
          aria-label={`${index + 1} star${index > 0 ? "s" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          className={`star-icon ${index <= filledUpTo ? "star-icon-filled" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          onMouseEnter={() => setHovered(index)}   // no DOM touching
          onMouseLeave={() => setHovered(null)}     // onMouseLeave, not onMouseOut
          onClick={() => setSelected(index)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  );
}
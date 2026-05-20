import { useRef, useState, useCallback } from "react";

const blocked = new Set([4, 5]);
const totalActiveBoxes = 7;

// .grid {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 5;
// }

export default function App() {
  const [state, setState] = useState(new Array(9).fill(0));
  const visitRef = useRef([]);

  const reset = useCallback(() => {
    const index = visitRef.current.pop();
    if (index === undefined) return;

    setState((prev) => {
      const next = [...prev];
      next[index] = 0;
      return next;
    });

    if (visitRef.current.length > 0) {
      setTimeout(reset, 300);
    }
  }, []);

  const clickHandler = useCallback(
    (index) => {
      if (blocked.has(index)) return;

      setState((prev) => {
        if (prev[index] === 1) return prev;

        const next = [...prev];
        next[index] = 1;
        visitRef.current.push(index);

        if (visitRef.current.length === totalActiveBoxes) {
          setTimeout(reset, 300);
        }

        return next;
      });
    },
    [reset],
  );

  return (
    <div className="grid">
      {state.map((item, index) => (
        <Box on={item} index={index} key={index} clickHandler={clickHandler} />
      ))}
    </div>
  );
}

const Box = ({ on, clickHandler, index }) => {
  if (index === 4 || index === 5) return <div />;

  const styleObj = {
    background: on === 0 ? "white" : "green",
    border: "1px solid black",
    width: "25px",
    height: "25px",
  };

  return <div style={styleObj} onClick={() => clickHandler(index)} />;
};

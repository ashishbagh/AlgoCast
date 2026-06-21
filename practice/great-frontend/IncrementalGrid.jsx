import React, { useState, useCallback } from "react";

export default function App() {
  const arr = Array.from({ length: 4 }, () => Array(4).fill(0));

  const [state, setState] = useState(arr);
  const [max, setMax] = useState(0);

  const clickHandler = useCallback(
    (r, c) => {
      let value = state[r][c];
      let newVal = 0;
      if (value === 0) {
        newVal = max + 1;
        setMax((prev) => prev + 1);
      } else {
        newVal = max;
      }
      setState((prev) => {
        return prev.map((inner, i) =>
          inner.map((value, j) => {
            if (i === r && j === c) return newVal;
            else return value;
          }),
        );
      });
    },
    [state, max],
  );
  return (
    <div className="grid">
      {state.map((items, i) =>
        items.map((value, j) => (
          <Cell clickHandler={clickHandler} value={value} i={i} j={j} />
        )),
      )}
    </div>
  );
}

const Cell = React.memo(({ clickHandler, i, j, value }) => {
  return (
    <div className="box" onClick={() => clickHandler(i, j)}>
      {value}
    </div>
  );
});

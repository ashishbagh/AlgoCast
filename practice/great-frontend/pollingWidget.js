import "./App.css";
import { useState, useMemo, useCallback } from "react";

function throttle(fn, delay = 3000) {
  const map = new Map();
  return function (...args) {
    const key = args[0];
    if (!map.has(key) || map.get(key) === 0) {
      map.set(key, 1);
      fn.apply(this, args);
      setTimeout(() => {
        map.set(key, 0);
      }, delay);
    }
  };
}

function App() {
  const [bars, setBars] = useState(new Array(4).fill(0));
  const total = bars.reduce((a, b) => a + b, 0);

  const fn = useCallback((index) => {
    setBars((prevBars) => {
      const newState = [...prevBars];
      newState[index]++;
      return newState;
    });
  }, []);

  const handlerChange = useMemo(() => throttle(fn, 9000), [fn]);

  return (
    <div className="App">
      <div>test</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {bars.map((item, index) => (
          <Bar
            fill={item}
            key={index}
            index={index}
            handler={handlerChange}
            total={total}
          />
        ))}
      </div>
    </div>
  );
}

const Bar = ({ fill = 20, index, handler, total = 0 }) => {
  const aggrFill = total > 0 ? Math.floor((100 / total) * fill) : 0;

  return (
    <div style={{ alignContent: "center", gap: "20px" }}>
      <div
        style={{ height: "200px", border: "1px solid black", width: "30px" }}
      >
        <div style={{ height: `${100 - aggrFill}%` }}></div>
        <div style={{ height: `${aggrFill}%`, background: "red" }}></div>
      </div>
      <button style={{ width: "80px" }} onClick={() => handler(index)}>
        Option {index}
      </button>
    </div>
  );
};

export default App;

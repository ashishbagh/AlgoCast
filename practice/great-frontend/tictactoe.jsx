import { useState } from "react";

export default function App() {
  // const [message, setMessage] = useState("Hello World!");
  const arr = Array.from({ length: 3 }, () => Array(3).fill(""));
  const [curr, setCurr] = useState([...arr]);
  const [turn, setTurn] = useState(false);

  const clickHandler = (event) => {
    const positions = event.target.id.split(",");
    const i = parseInt(positions[0]);
    const j = parseInt(positions[1]);
    const tempCurr = [...curr];
    if (tempCurr[i][j]) return;
    tempCurr[i][j] = turn ? "O" : "X";
    setTurn(!turn);
    setCurr(tempCurr);
    if (checkCurrStatus(tempCurr)) alert("player won");
  };

  const checkCurrStatus = (tempCurr) => {
    for (let row of tempCurr) {
      if (row.join("") === "XXX") return true;
      if (row.join("") === "OOO") return true;
      continue;
    }
    let j = 0;
    while (j < 3) {
      let result = [];
      for (let r = 0; r < tempCurr.length; r++) {
        result.push(tempCurr[r][j]);
      }
      if (result.join("") === "XXX") return true;
      if (result.join("") === "OOO") return true;
      j++;
    }

    let verticalX = [tempCurr[0][0], tempCurr[1][1], tempCurr[2][2]];
    let verticalY = [tempCurr[0][2], tempCurr[1][1], tempCurr[2][0]];
    if (verticalX.join("") === "XXX") return true;
    if (verticalX.join("") === "OOO") return true;
    if (verticalY.join("") === "XXX") return true;
    if (verticalY.join("") === "OOO") return true;

    return false;
  };

  let currTurn = turn ? "O" : "X";
  return (
    <div>
      <p>Player {currTurn} turn ...</p>
      <tbody>
        {curr.map((items, index) => (
          <tr style={{ display: "flex" }}>
            {items.map((_, ind) => (
              <td>
                <span
                  style={{
                    display: "flex",
                    border: "1px solid grey",
                    height: "10px",
                    width: "10px",
                    padding: "3rem",
                  }}
                  onClick={clickHandler}
                  key={`${index}${ind}`}
                  id={[`${index}`, `${ind}`]}
                >
                  {_}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <button
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
        onClick={() => setCurr([...arr])}
      >
        Reset
      </button>
    </div>
  );
}

import { useState } from "react";

const fillMap = { 0: "red", 1: "yellow", 2: "white" };
const set = new Set();
export default function App() {
  const arr = Array.from({ length: 6 }, () => new Array(7).fill(2));

  const [state, setState] = useState(arr);
  const [msg, setMessage] = useState("");
  const [turn, setTurn] = useState(0);
  const [sel, setSel] = useState(Array(7).fill(2));
  const handleHover = (index, isFill) => {
    const newSel = [...sel];
    newSel[index] = isFill === 0 || isFill === 1 ? isFill : 2;
    setSel([...newSel]);
  };

  const clickHandler = (index) => {
    for (let r = 5; r >= 0; r--) {
      let key = `${r},${index}`;
      if (set.has(key)) continue;
      let newState = [...state];
      newState[r][index] = turn;
      setState(newState);
      setTurn(turn === 0 ? 1 : 0);
      set.add(key);
      const winner = checkWinner(newState);
      if (winner !== null) setMessage(`${winner} wins`);

      break;
    }
  };

  const checkWinner = (board) => {
    const rows = board.length;
    const cols = board[0].length;

    // horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        const val = board[r][c];
        if (
          val !== 2 &&
          val === board[r][c + 1] &&
          val === board[r][c + 2] &&
          val === board[r][c + 3]
        ) {
          return val;
        }
      }
    }

    // vertical
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c < cols; c++) {
        const val = board[r][c];
        if (
          val !== 2 &&
          val === board[r + 1][c] &&
          val === board[r + 2][c] &&
          val === board[r + 3][c]
        ) {
          return val;
        }
      }
    }

    // diagonal down-right
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        const val = board[r][c];
        if (
          val !== 2 &&
          val === board[r + 1][c + 1] &&
          val === board[r + 2][c + 2] &&
          val === board[r + 3][c + 3]
        ) {
          return val;
        }
      }
    }

    // diagonal down-left
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 3; c < cols; c++) {
        const val = board[r][c];
        if (
          val !== 2 &&
          val === board[r + 1][c - 1] &&
          val === board[r + 2][c - 2] &&
          val === board[r + 3][c - 3]
        ) {
          return val;
        }
      }
    }

    return null;
  };

  return (
    <div>
      <div>{msg}</div>
      <div className="cell">
        {sel.map((fill, index) => (
          <div
            fill={fill}
            className="circle"
            style={{
              background: fillMap[fill],
              cursor: "pointer",
            }}
            onMouseOver={() => {
              handleHover(index, turn);
            }}
            onMouseLeave={() => {
              handleHover(index);
            }}
            onClick={() => clickHandler(index)}
          ></div>
        ))}
      </div>
      <div className="grid">
        {state.flatMap((cols, r) => {
          return (
            <>
              {cols.map((fill, c) => (
                <Circle fill={fill} r={r} c={c} />
              ))}
            </>
          );
        })}
      </div>
    </div>
  );
}

const Circle = ({ r, c, fill }) => {
  let key = `${r}${c}`;
  return (
    <div style={{ background: `${fillMap[fill]}` }} className="circle"></div>
  );
};

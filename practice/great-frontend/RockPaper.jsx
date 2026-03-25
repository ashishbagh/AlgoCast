import React, { useState } from "react";
import "./App.css";

/*
Rock Paper Scissors

Rock > Scissors
Scissors > Paper
Paper > Rock

1. Provide a selection for the user to select one of the options (R | P | S)
2. Randomly generate a computer option (R | P | S)
3. Decide the winner
4. Display winner
5. Table to display number of Wins By Computer vs player
6. Reset button to clear the results
*/

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function App() {
  const options = ["R", "P", "S"];

  const defaultUserMap = { user: 0, computer: 0, tie: 0 };
  const [data, setData] = useState({ user: 0, computer: 0, tie: 0 });
  const [userSelected, setUserSelected] = useState("");
  const [compSelected, setCompSelected] = useState("");

  const handler = (event) => {
    const id = parseInt(event.target.id);
    const selectedOption = options[id];
    const computerSelected = options[getRandomInt(0, 2)];
    const temp = data;
    setUserSelected(selectedOption);
    setCompSelected(computerSelected);
    if (selectedOption === computerSelected) {
      temp["tie"] += 1;
    } else if (
      (selectedOption === "R" && computerSelected === "S") ||
      (selectedOption === "P" && computerSelected === "R") ||
      (selectedOption === "S" && computerSelected === "P")
    ) {
      temp["user"] += 1;
    } else {
      temp["computer"] += 1;
    }

    setData({ ...temp });
  };

  return (
    <div className="app">
      <tbody>
        <tr style={{ display: "flex", padding: "2rem" }}>
          {options.map((option, index) => (
            <td
              id={index}
              onClick={handler}
              style={{
                display: "flex",
                border: "1px solid",
                height: "40px",
                width: "40px",
              }}
              key={index}
            >
              {option}
            </td>
          ))}
        </tr>
      </tbody>
      <div>
        {Object.keys(data).map((key, index) => (
          <div style={{ display: "flex", margin: "2rem" }}>
            <span>{key}</span>
            <span>{data[key]}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setData(defaultUserMap);
        }}
      >
        Reset
      </button>
      <div> user selected {userSelected}</div>
      <div> computer selected {compSelected}</div>
    </div>
  );
}

export default App;

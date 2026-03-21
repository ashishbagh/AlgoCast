// Build a traffic light where the lights switch from
// green to yellow to red after predetermined intervals and loop indefinitely. Each light should be lit for the following durations:

// Red light: 4000ms
// Yellow light: 500ms
// Green light: 3000ms
// You are free to exercise your creativity to style the appearance of the traffic light.

import { useState, useEffect } from "react";

export default function TrafficLight() {
  const lights = { red: 4000, yellow: 10000, green: 3000 };
  const defaultState = {
    red: false,
    yellow: false,
    green: false,
  };

  const [state, setState] = useState(defaultState);

  useEffect(() => setIntervals(0), []);

  const setIntervals = (key) => {
    const keys = Object.keys(state);
    const newState = { ...defaultState };
    newState[keys[key]] = true;
    setState(newState);
    let nextKey = key + 1;
    if (nextKey > 2) nextKey = 0;
    // Set next light true after current
    setTimeout(() => setIntervals(nextKey), lights[keys[key]]);
  };

  return (
    <div
      style={{
        // display: "flex",
        // justifyContent: "space-evenly",
        backgroundColor: "black",
        width: "4rem",
        borderRadius: "10px",
        padding: "1rem",
      }}
    >
      {Object.keys(lights).map((item) => {
        return (
          <div
            style={{
              backgroundColor: state[item] ? item : "grey",
              padding: "2rem",
              marginBottom: "5px",
              border: "1px solid",
              borderRadius: "2rem",
            }}
          />
        );
      })}
    </div>
  );
}



[1,1,3,3]--->
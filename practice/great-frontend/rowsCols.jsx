// Generate a table of numbers given the rows and columns.
// The user enters the number of rows and columns in a form.
// When the form is submitted, a table with the respective number of rows and columns will be generated.
// The table contains rows x columns cells, each containing a number sequence from 1 to (rows x columns).

import { useState } from "react";

export default function App() {
  const [rowsCols, setRowsCols] = useState({ rows: 0, cols: 0 });
  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rows = formData.get("rows");
    const cols = formData.get("cols");
    setRowsCols({ rows, cols });
  };

  return (
    <>
      <form onSubmit={submit}>
        <input type="number" min={1} name="rows" />
        <input type="number" min={1} name="cols" />
        <button type="submit">Submit</button>
      </form>
      <div style={{ padding: "10px" }}>
        <Table {...rowsCols} />
      </div>
    </>
  );
}

const Table = ({ rows, cols }) => {
  let rowArr = new Array(parseInt(rows)).fill(1);
  let colArr = new Array(parseInt(cols)).fill(1);
  return (
    <>
      <tbody>
        {rowArr.map((_, row) => {
          return (
            <tr>
              {colArr.map((_, col) => {
                let val = 1;
                if (col % 2 === 0) val = rows * col + (row + 1);
                else val = rows * (col + 1) - row;
                return (
                  <td
                    style={{
                      border: "1px solid",
                      padding: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </>
  );
};

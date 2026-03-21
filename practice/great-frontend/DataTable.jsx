import { useState } from "react";
import users from "./data/users";

import { useEffect } from "react";

export default function DataTable() {
  const [cursor, setCursor] = useState(0);
  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(1);
  const [curr, setCurr] = useState([...users].slice(cursor, cursor + limit));
  let n = Math.ceil(users.length / limit);

  const [totalPages, setTotalPages] = useState(n);

  useEffect(() => {
    setCursor(0);
    setCurr([...users].slice(cursor, cursor + limit));
    n = Math.ceil(users.length / limit);
    setTotalPages(n);
  }, [limit]);

  const handlePagination = (event) => {
    const id = parseInt(event.target.id);
    setCurrPage(id + 1);
    let newCursor = limit * id;
    setCursor(newCursor);
    setCurr([...users].slice(newCursor, newCursor + limit));
  };

  return (
    <div>
      <h1>Data Table</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          marginBottom: "2rem",
        }}
      >
        <input
          type="number"
          id="limit"
          label="limit"
          onChange={(event) =>
            setTimeout(() => setLimit(parseInt(event.target.value)), 100)
          }
        />
      </div>
      <table
        style={{
          width: "100%",
          padding: "2rem",
          marginBottom: "2rem",
          // justifyContent: "space-evenly",
        }}
      >
        <thead>
          <tr>
            {[
              { label: "ID", key: "id" },
              { label: "Name", key: "name" },
              { label: "Age", key: "age" },
              { label: "Occupation", key: "occupation" },
            ].map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {curr.map(({ id, name, age, occupation }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
              <td>{occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div
            onClick={(event) => {
              event.target.id = currPage - 2;
              handlePagination(event);
            }}
          >
            Prev
          </div>
          <div
            onClick={(event) => {
              event.target.id = currPage;
              handlePagination(event);
            }}
          >
            Next
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginRight: "5px",
            justifyContent: "space-evenly",
          }}
        >
          {Array(n)
            .fill(1)
            .map((_, index) => (
              <span
                style={{
                  marginRight: "2px",
                  color: `${currPage - 1 === index ? "blue" : "grey"}`,
                }}
                key={index}
                id={index}
                onClick={handlePagination}
              >
                {index + 1}
              </span>
            ))}
        </div>
        <span>{`${currPage} of ${totalPages}`}</span>
      </div>
    </div>
  );
}

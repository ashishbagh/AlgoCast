import { useState, useMemo, useCallback } from "react";
import users from "./data/users";

const colums = [
  { key: "id", type: "text", editable: false, text: "id" },
  { key: "name", type: "text", editable: false, text: "name" },
  { key: "age", type: "text", editable: false, text: "age" },
  { key: "occupation", type: "text", editable: false, text: "occupation" },
];

export default function DataTable() {
  const [message, setMessage] = useState("Data Table");
  const [data, setData] = useState(users);
  const [limit, setLimit] = useState(5);
  const [currIndex, setCurrIndex] = useState(0);
  let timeoutId;

  const pageCount = useMemo(
    () => Math.ceil(data.length / limit),
    [data, limit],
  );

  const currData = useMemo(() => {
    let cursor = currIndex * limit;
    return data.slice(cursor, cursor + limit);
  }, [limit, currIndex, data]);

  const handleNext = (action) => {
    if (action === "prev") setCurrIndex((prev) => prev - 1);
    else setCurrIndex((prev) => prev + 1);
  };

  const handleSearch = useCallback(
    (query) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setData((prev) => {
          if (query !== "")
            return users.filter(({ name }) =>
              name.toLowerCase().includes(query.toLowerCase()),
            );
          else return users;
        });
      }, 2000);
    },
    [users],
  );

  const sort = () => {
    const sortedData = [...data].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setData(sortedData);
  };

  return (
    <div>
      <div className="footer">
        <input
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <button onClick={() => sort()}>Sort by Name</button>
      </div>
      <div className="cols">
        {colums.map(({ text }) => (
          <th>{text}</th>
        ))}
      </div>
      <div className="cols datagrid">
        {currData.map((item) => colums.map(({ key }) => <td>{item[key]}</td>))}
      </div>
      <div className="footer">
        <div className="pages">
          {Array(pageCount)
            .fill(0)
            .map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrIndex(index)}
                style={{
                  color: currIndex === index ? "blue" : "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </span>
            ))}
        </div>
        <div className="btn">
          {currIndex !== 0 && (
            <button onClick={() => handleNext("prev")}>Prev</button>
          )}
          {currIndex !== pageCount - 1 && (
            <button onClick={() => handleNext("next")}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

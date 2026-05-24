import { useCallback, useMemo, useState } from "react";

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grapes",
  "Guava",
  "Kiwi",
  "Mango",
  "Orange",
  "Papaya",
  "Pineapple",
  "Strawberry",
  "Watermelon",
];

function debounce(fn, wait) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = useCallback((value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = fruits.filter((fruit) =>
      fruit.toLowerCase().includes(value.toLowerCase()),
    );

    setSuggestions(filtered);
  }, []);

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearch, 300);
  }, [handleSearch]);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = useCallback((fruit) => {
    setQuery(fruit);
    setSuggestions([]);
  }, []);

  return (
    <div style={{ width: "300px", margin: "40px auto", position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search fruits..."
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            borderTop: "none",
            position: "absolute",
            width: "100%",
            background: "white",
          }}
        >
          {suggestions.map((fruit) => (
            <li
              key={fruit}
              onClick={() => handleSelect(fruit)}
              style={{ padding: "10px", cursor: "pointer" }}
            >
              {fruit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

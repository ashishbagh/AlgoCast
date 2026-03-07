import React, { useEffect, useState } from "react";
import HeaderLink from "./HeaderLink";
function Header() {
  let n = 16000;
  let [count, setCount] = useState(800);
  let items = new Array(n).fill(0);
  let callback = (entries) => {
    const { isIntersecting = false } = entries[0];
    if (isIntersecting) {
      console.log(`Infinte scroll trigger at ${count}`);
      setCount(count + 800);
    }
  };
  const observer = new IntersectionObserver(callback, {});

  useEffect(() => {
    const lastIndex = document.getElementById(count);
    observer.observe(lastIndex);

    return () => observer.unobserve(lastIndex);
  }, [count]);

  return (
    <div className="container-fluid ">
      <div className="row" style={{ display: "block", padding: "2rem" }}>
        {items.map((_, index) => (
          <div id={index + 1} style={{ display: "flex", width: "100%" }}>
            Test {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Header;

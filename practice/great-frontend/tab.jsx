import { useState } from "react";

export default function Tabs() {
  const [tabState, setTabState] = useState({ 1: false, 2: false, 3: true });
  const changeState = (event) => {
    let obj = { 1: false, 2: false, 3: false };
    obj[event.target.id] = true;
    setTabState(obj);
  };

  return (
    <div>
      <div>
        <button
          id="1"
          style={{
            backgroundColor: `${tabState["1"] ? "purple" : "white"}`,
            marginRight: "4px",
            padding: "2px",
          }}
          onClick={changeState}
        >
          HTML
        </button>
        <button
          id="2"
          style={{
            backgroundColor: `${tabState["2"] ? "purple" : "white"}`,
            marginRight: "4px",
          }}
          onClick={changeState}
        >
          CSS
        </button>
        <button
          id="3"
          style={{
            backgroundColor: `${tabState["3"] ? "purple" : "white"}`,
            marginRight: "4px",
          }}
          onClick={changeState}
        >
          JavaScript
        </button>
      </div>
      <div>
        {tabState["1"] && (
          <p>
            The HyperText Markup Language or HTML is the standard markup
            language for documents designed to be displayed in a web browser.
          </p>
        )}
        {tabState["2"] && (
          <p>
            Cascading Style Sheets is a style sheet language used for describing
            the presentation of a document written in a markup language such as
            HTML or XML.
          </p>
        )}
        {tabState["3"] && (
          <p>
            JavaScript, often abbreviated as JS, is a programming language that
            is one of the core technologies of the World Wide Web, alongside
            HTML and CSS.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DOM TO OBJECT SERIALIZER
// Reverse of htmlSerializer.js — takes a real DOM element
// and converts it to a plain JS object tree
// ─────────────────────────────────────────────────────────────
//
// Input:  A live DOM Element  (e.g. document.querySelector('div'))
// Output: A plain JS object   (e.g. { tag, attributes, children })
//
// Node types we handle:
//   nodeType === 1 → Element   (div, span, h1, etc.)  → { tag, attributes, children }
//   nodeType === 3 → Text      ("Hello World")         → plain string
//   nodeType === 8 → Comment   (<!-- ... -->)          → skipped
//   Whitespace-only text nodes                         → skipped
//
// Output shape:
// {
//   tag: "div",
//   attributes: { class: "container", id: "main" },  // omitted if no attributes
//   children: [                                        // omitted if no children
//     { tag: "h1", children: ["Hello World"] },
//     "plain text",
//   ]
// }

// ─────────────────────────────────────────────────────────────
// NODE.JS SETUP — run: npm install jsdom
// jsdom gives us a full DOM environment in Node.js
// ─────────────────────────────────────────────────────────────
const { JSDOM } = require("jsdom");

// Give Node.js the same globals a browser has (Node, document, etc.)
const { window } = new JSDOM("");
const { Node, document } = window;

/**
 * @param {Element} element - A real DOM node
 * @return {Object|string|null}
 */
function domToObject(element) {

    // ── TEXT NODE ─────────────────────────────────────────────
    // nodeType 3 = text node (e.g. "Hello World" between tags)
    if (element.nodeType === Node.TEXT_NODE) {
        const text = element.nodeValue.trim();
        // skip whitespace-only text nodes (indentation, newlines between tags)
        return text.length > 0 ? text : null;
    }

    // ── COMMENT NODE ─────────────────────────────────────────
    // nodeType 8 = <!-- comment --> — skip entirely
    if (element.nodeType === Node.COMMENT_NODE) {
        return null;
    }

    // ── ELEMENT NODE ─────────────────────────────────────────
    // nodeType 1 = regular HTML element
    if (element.nodeType === Node.ELEMENT_NODE) {
        const result = {
            tag: element.tagName.toLowerCase(), // "DIV" → "div"
        };

        // ── Attributes ───────────────────────────────────────
        // element.attributes = NamedNodeMap [class="foo", id="bar", ...]
        // Only add attributes key if element has at least one attribute
        if (element.attributes.length > 0) {
            result.attributes = {};
            for (const attr of element.attributes) {
                result.attributes[attr.name] = attr.value;
                // e.g. { class: "container", id: "main", "data-id": "42" }
            }
        }

        // ── Children ─────────────────────────────────────────
        // element.childNodes includes text + comment + element nodes
        // element.children includes ONLY element nodes (no text)
        // We use childNodes to also capture text content
        const children = [];
        for (const child of element.childNodes) {
            const serialized = domToObject(child); // recurse
            if (serialized !== null) {             // filter out nulls (whitespace, comments)
                children.push(serialized);
            }
        }

        // Only add children key if there are actual children
        if (children.length > 0) {
            result.children = children;
        }

        return result;
    }

    // unknown node type → skip
    return null;
}


// ─────────────────────────────────────────────────────────────
// EXAMPLE (run in browser console or jsdom environment)
// ─────────────────────────────────────────────────────────────
//
// Given this DOM:
//
//   <body>
//     <div class="container" id="main">
//       <h1>Hello World</h1>
//       <!-- this is a comment -->
//       <p class="text">
//         Some <span style="color:red">bold</span> text
//       </p>
//     </div>
//   </body>
//
// domToObject(document.querySelector('.container')) produces:
//
// {
//   tag: "div",
//   attributes: { class: "container", id: "main" },
//   children: [
//     {
//       tag: "h1",
//       children: ["Hello World"]
//     },
//     {                                          ← comment skipped ✅
//       tag: "p",
//       attributes: { class: "text" },
//       children: [
//         "Some",                                ← text node ✅
//         {
//           tag: "span",
//           attributes: { style: "color:red" },
//           children: ["bold"]
//         },
//         "text"                                 ← text node ✅
//       ]
//     }
//   ]
// }


// ─────────────────────────────────────────────────────────────
// NODE.JS / JSDOM VERSION
// ─────────────────────────────────────────────────────────────
// If running outside the browser (Node.js), use jsdom to get a DOM:
//
//   import { JSDOM } from 'jsdom';
//   const dom = new JSDOM(`<div class="container"><h1>Hello</h1></div>`);
//   const element = dom.window.document.querySelector('div');
//   console.log(domToObject(element));
//
// Or write a version that works on a plain HTML string directly:

/**
 * Parse an HTML string and serialize the first matching element
 * Works in browser only (uses DOMParser)
 * @param {string} htmlString
 * @return {Object}
 */
function htmlStringToObject(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const root = doc.body.firstElementChild; // get the first real element
    return domToObject(root);
}

// Example:
// htmlStringToObject(`<div class="box"><h1>Title</h1><p>Body text</p></div>`)
//
// Output:
// {
//   tag: "div",
//   attributes: { class: "box" },
//   children: [
//     { tag: "h1", children: ["Title"] },
//     { tag: "p",  children: ["Body text"] }
//   ]
// }


// ─────────────────────────────────────────────────────────────
// TEST — run with: node DOMtoObjecSer.js
// (requires: npm install jsdom)
// ─────────────────────────────────────────────────────────────

const htmlString = `
  <div class="container" id="main">
    <h1>Hello World</h1>
    <!-- this comment should be skipped -->
    <p class="text">Some <span style="color:red">bold</span> text</p>
  </div>
`;

// parse HTML string → DOM element using jsdom
// const dom = new JSDOM(htmlString);
// const root = dom.window.document.querySelector(".container");

const result = domToObject(root);
console.log(JSON.stringify(result, null, 2));

// Expected output:
// {
//   "tag": "div",
//   "attributes": { "class": "container", "id": "main" },
//   "children": [
//     { "tag": "h1", "children": ["Hello World"] },
//     {
//       "tag": "p",
//       "attributes": { "class": "text" },
//       "children": [
//         "Some",
//         { "tag": "span", "attributes": { "style": "color:red" }, "children": ["bold"] },
//         "text"
//       ]
//     }
//   ]
// }

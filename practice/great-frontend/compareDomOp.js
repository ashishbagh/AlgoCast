// ADD , REMOVE, UPDATE, REPLACE

// path = index trail from root to current node e.g. [0, 1, 2]
//   [0]       → first child of root
//   [0, 1]    → second child of root's first child
//   [0, 1, 0] → first child of that node (text node)

let result = [];

const compareDoms = (newTree, oldTree, path = []) => {

  // ── Both removed / never existed ──────────────────────────
  if (!newTree && !oldTree) return;

  // ── Node removed (exists in old, gone in new) ─────────────
  if (!newTree) {
    result.push({ type: "REMOVE_NODE", path: [...path] }); // ✅ clone path — don't store reference
    return;
  }

  // ── Node added (new node, didn't exist before) ────────────
  if (!oldTree) {
    result.push({ type: "ADD_NODE", path: [...path], value: newTree });
    return;
  }

  // ── Text node comparison ──────────────────────────────────
  if (typeof newTree === "string" || typeof oldTree === "string") {
    if (newTree !== oldTree) {
      result.push({ type: "UPDATE_TEXT", path: [...path], value: newTree });
    }
    return;
  }

  // ── Tag/type changed → replace entire node ────────────────
  // No need to diff children of a replaced node
  if (newTree.type !== oldTree.type) {
    result.push({ type: "REPLACE_NODE", path: [...path], node: newTree });
    return;
  }

  // ── Same type → diff children ─────────────────────────────
  const newChildren = newTree.children || [];
  const oldChildren = oldTree.children || [];
  const maxLen = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLen; i++) {
    const newChild = newChildren[i]; // undefined if new list is shorter
    const oldChild = oldChildren[i]; // undefined if old list is shorter
    const childPath = [...path, i];  // ✅ new array each time — parent path never mutated

    compareDoms(newChild, oldChild, childPath); // recurse with full path
  }

  return result;
};

// Input
// const oldTree = {
//   type: "div",
//   children: [
//     { type: "h1", children: ["Hello"] },
//     { type: "p", children: ["World"] },
//   ],
// };

// const newTree = {
//   type: "div",
//   children: [
//     { type: "h1", children: ["Hello"] },
//     { type: "p", children: ["Everyone"] },
//     { type: "span", children: ["!"] },
//   ],
// };

// Input
const oldTree = {
  type: "div",
  children: [
    {
      type: "section",
      children: [
        { type: "h2", children: ["Title"] },
        {
          type: "ul",
          children: [
            { type: "li", children: ["A"] },
            { type: "li", children: ["B"] },
          ],
        },
      ],
    },
    { type: "footer", children: ["v1"] },
  ],
};
const newTree = {
  type: "div",
  children: [
    {
      type: "section",
      children: [
        { type: "h2", children: ["New Title"] }, // text update
        {
          type: "ul",
          children: [
            { type: "li", children: ["A"] }, // unchanged
            { type: "li", children: ["B2"] }, // text update
            { type: "li", children: ["C"] }, // add
          ],
        },
      ],
    },
    // footer removed
  ],
};

console.log(compareDoms(newTree, oldTree));

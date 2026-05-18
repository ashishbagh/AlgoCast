const selfClosingTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const JSONToHTMl = (node) => {
  if (typeof node === "string") {
    return node;
  }

  let tag = node.tag;
  let attributes = "";
  if (node && node.attributes) {
    Object.entries(node.attributes).forEach(([key, value]) => {
      attributes += value === true ? ` ${key}` : ` ${key}="${value}"`;
    });
  }

  let children = [];
  if (selfClosingTags.has(tag)) {
    return `<${tag}${attributes} />`;
  }
  children = (node.children || []).map((child) => JSONToHTML(child));
  return `<${tag}${attributes}>${children.join("")}</${tag}>`;
};

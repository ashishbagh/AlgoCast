function parseHTML(html) {
  const root = {
    tag: "root",
    children: [],
  };

  const stack = [root];
  let i = 0;

  function parseAttributes(str) {
    const attrs = {};
    const regex = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g; // "/(\w+)="([^"]*)"/g"
    let match;

    while ((match = regex.exec(str)) !== null) {
      const key = match[1];
      const val = match[2] ?? match[3] ?? match[4];
      attrs[key] = val !== undefined ? val : true;
    }

    return attrs;
  }

  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i);
      i = end === -1 ? html.length : end + 3;
      continue;
    }

    if (html[i] === "<") {
      const end = html.indexOf(">", i);
      if (end === -1) break;

      if (html[i + 1] === "/") {
        if (stack.length > 1) {
          stack.pop();
        }
        i = end + 1;
        continue;
      }

      let content = html.slice(i + 1, end).trim();
      const selfClosing = content.endsWith("/");

      if (selfClosing) {
        content = content.slice(0, -1).trim();
      }

      const space = content.search(/\s/);
      const tag = space === -1 ? content : content.slice(0, space);
      const attrStr = space === -1 ? "" : content.slice(space + 1);

      const node = {
        tag,
        children: [],
      };

      const attrs = parseAttributes(attrStr);
      if (Object.keys(attrs).length > 0) {
        node.attributes = attrs;
      }

      stack[stack.length - 1].children.push(node);

      if (!selfClosing) {
        stack.push(node);
      }

      i = end + 1;
      continue;
    }

    const next = html.indexOf("<", i);
    const end = next === -1 ? html.length : next;
    const text = html.slice(i, end).replace(/\s+/g, " ").trim();

    if (text) {
      stack[stack.length - 1].children.push(text);
    }

    i = end;
  }

  return root.children;
}

const test = `<div class="container" id="main">
  <h1>Hello World</h1>
  <!-- this is a comment -->
  <p class="text">
    Some <span style="color:red">bold</span> text
  </p>
  <img src="text" />
</div>`;

console.log(parseHTML(test));

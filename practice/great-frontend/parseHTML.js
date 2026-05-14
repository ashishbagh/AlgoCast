function parseHTML(html) {
  const stack = [];
  let root = null;
  let i = 0;

  const parseAttributes = (str) => {
    const attrs = {};
    const regex = /([^\s=]+)="([^"]*)"/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      attrs[match[1]] = match[2];
    }

    return attrs;
  };

  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i);
      i = end + 3;
      continue;
    }

    if (html[i] === "<") {
      if (html[i + 1] === "/") {
        const close = html.indexOf(">", i);
        stack.pop();
        i = close + 1;
      } else {
        const close = html.indexOf(">", i);
        const content = html.slice(i + 1, close).trim();

        const firstSpace = content.indexOf(" ");
        const tag = firstSpace === -1 ? content : content.slice(0, firstSpace);

        const attrString =
          firstSpace === -1 ? "" : content.slice(firstSpace + 1);

        const node = {
          tag,
        };

        const attributes = parseAttributes(attrString);
        if (Object.keys(attributes).length > 0) {
          node.attributes = attributes;
        }

        node.children = [];

        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        } else {
          root = node;
        }

        stack.push(node);
        i = close + 1;
      }
    } else {
      const nextTag = html.indexOf("<", i);
      const end = nextTag === -1 ? html.length : nextTag;
      const text = html.slice(i, end).replace(/\s+/g, " ").trim();

      if (text && stack.length > 0) {
        stack[stack.length - 1].children.push(text);
      }

      i = end;
    }
  }

  return root;
}

const test = `<div class="container" id="main">
  <h1>Hello World</h1>
  <!-- this is a comment -->
  <p class="text">
    Some <span style="color:red">bold</span> text
  </p>
</div>`;

console.log(parseHTML(test));

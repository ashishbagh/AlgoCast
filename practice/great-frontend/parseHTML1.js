function parseHTML(html) {
  let root = {
    tag: "root",
    children: [],
  };

  let stack = [root];

  let parseAttributes = (str) => {
    let attr = {};
    let regex = /(\w+)="([^"]*)"/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      let key = match[1];
      let val = match[2] ?? match[3] ?? match[4];
      attr[key] = val !== undefined ? val : true;
    }
  };
  let i = 0;
  while (i < html.length) {
    if (html[i].startsWith("<!--", i)) {
      const end = html[i].indexOf("-->", i);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html[i] === "<") {
      let end = html[i].indexOf(">", i);
      if (end === -1) break;

      if (html[i + 1] === "/") {
        i = end + 1;
        if (stack.length > 1) stack.pop();
        continue;
      }

      let content = html.slice(i + 1, end).trim();
      let isSelfClosing = content.endsWith("/");

      if (isSelfClosing) {
        content = content.slice(0, -1).trim();
      }

      const space = content.search(/\s/);
      const tag = space === -1 ? content : content.slice(0, space);
      const attrStr = space === -1 ? "" : content.slice(space + 1);

      let node = {
        tag,
        children: [],
      };

      let attr = parseAttributes(attrStr);
      if (Object.keys(attr).length > 0) {
        node.attributes = attr;
      }
    }
  }
}

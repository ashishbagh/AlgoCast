/**
 * @param {Object} element
 * @return {string}
 */
export default function serializeHTML(element) {
    // let result = "";

    const serializer = (root) => {
        const { tag, children = [] } = root;

        let inner = "";
        children.forEach((child) => {
            if (typeof child === "object") {
                inner += "\n\t" + serializer(child);
            } else {
                inner += "\n\t" + child;   // \n\t before every child text
            }
        });

        return `<${tag}>${inner}\n</${tag}>`;  // \n before closing tag
    };

    return serializer(element);
}



const element = {
    tag: "div",
    children: [
        { tag: "h1", children: ["Hello World"] },
    ],
};

console.log(serializeHTML(element));


// describe('HTML serializer', () => {
//     test('single children', () => {
//       expect(
//         serializeHTML({
//           tag: 'div',
//           children: ['foo'],
//         }),
//       ).toEqual('<div>\n\tfoo\n</div>');
//     });
  
//     test('single tag two children', () => {
//       expect(serializeHTML({ children: ['bar1', 'bar2'], tag: 'span' })).toEqual(
//         '<span>\n\tbar1\n\tbar2\n</span>',
//       );
//     });

// test('deeply nested', () => {
//     expect(
//       serializeHTML({
//         tag: 'body',
//         children: [
//           { tag: 'div', children: [{ tag: 'span', children: ['foo', 'bar'] }] },
//           { tag: 'div', children: ['baz'] },
//         ],
//       }),
//     ).toEqual(
//       '<body>\n\t<div>\n\t\t<span>\n\t\t\tfoo\n\t\t\tbar\n\t\t</span>\n\t</div>\n\t<div>\n\t\tbaz\n\t</div>\n</body>',
//     );
//   });
//   });
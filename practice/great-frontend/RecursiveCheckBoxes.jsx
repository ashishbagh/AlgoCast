import { useState } from "react";

export default function Checkboxes({ defaultCheckboxData }) {
  const [state, setState] = useState(defaultCheckboxData);

  const handleCheck = (id, isChecked) => {
    const newState = [...state];
    updateNode(id, isChecked, newState);
    updateParent(newState);
    console.log(newState);
    setState([...newState]);
  };

  const updateNode = (id, checked, nodes) => {
    for (const node of nodes) {
      if (!node.isIndeterminate) node.isIndeterminate = false;
      if (node.id === id || id === "child") {
        node.checked = checked;
        if (node?.children && node.children.length > 0)
          updateNode("child", checked, node.children);
      } else {
        if (node?.children && node.children.length > 0)
          updateNode(id, checked, node.children);
      }
    }
  };

  const updateParent = (nodes) => {
    for (const node of nodes) {
      if (node?.children && node.children.length > 0) {
        updateParent(node.children);

        const allChecked = node.children.every((child) => child.checked);
        const someChecked = node.children.some(
          (child) => child.checked || child.isIndeterminate,
        );

        node.checked = allChecked;
        node.isIndeterminate = !allChecked && someChecked;
      }
    }
  };

  return (
    <div>
      <pre>
        {state.map((item, index) => (
          <CheckBoxComponent
            key={item.name || index}
            {...item}
            handleCheck={handleCheck}
          />
        ))}
      </pre>
    </div>
  );
}

const CheckBoxComponent = ({
  checked = false,
  isIndeterminate = false,
  children = [],
  name = "",
  handleCheck,
  id,
}) => {
  const onChange = (event) => {
    handleCheck(id, event.target.checked);
  };
  return (
    <div>
      <div>
        <input
          type="checkbox"
          //checked={isChecked}
          onClick={onChange}
          ref={(el) => {
            if (el) {
              el.indeterminate = isIndeterminate;
              el.checked = checked;
            }
          }}
        />
        <span>{name}</span>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        {children.map((item, index) => (
          <CheckBoxComponent
            key={item.name || index}
            {...item}
            handleCheck={handleCheck}
          />
        ))}
      </div>
    </div>
  );
};

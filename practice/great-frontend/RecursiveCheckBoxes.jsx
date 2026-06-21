import { useState } from "react";

export default function Checkboxes({ defaultCheckboxData }) {
  const [state, setState] = useState(defaultCheckboxData);

  const handleChange = (id, node, isChecked) => {
    const updatedNode = updateNode(node, isChecked);
    setState((prev) => updateNodeById(id, updatedNode, prev));
    const newState = [...state];
    updateParent(newState);
    setState(newState);
  };

  const updateParent = (nodes) => {
    for (const node of nodes) {
      if (node?.children && node.children.length > 0) {
        updateParent(node.children);
        const allChecked = node.children.every((child) => child.checked);
        const some = node.children.some(
          (child) => child.checked || child.isIndeterminate,
        );
        node.checked = allChecked;
        node.isIndeterminate = !allChecked && some;
      }
    }
  };

  const updateNode = (node, isChecked) => {
    const dfs = (item) => {
      if (!item) return;
      if (item.children && item.children.length === 0) return;
      item.checked = isChecked;
      if (item && item.children && item.children.length > 0) {
        for (const child of item.children) {
          dfs(child);
        }
      }
      return;
    };
    dfs(node);
    return node;
  };

  const updateNodeById = (id, updateNode, nodes) => {
    return nodes.map((node) => {
      if (!node.isIndeterminate) node.isIndeterminate = false;
      if (node.id === id) return updateNode;
      if (node.children) {
        return {
          ...node,
          children: updateNodeById(id, updateNode, node.children),
        };
      }

      return node;
    });
  };

  return (
    <div>
      {state.map((items) => (
        <Checkbox node={items} handleChange={handleChange} />
      ))}
    </div>
  );
}

const Checkbox = ({ node, handleChange }) => {
  const { id, name, checked, children = [], isIndeterminate = false } = node;

  return (
    <div>
      <div className="checkBox">
        <input
          type="checkbox"
          id={id}
          onClick={(event) => {
            handleChange(id, node, event.target.checked);
          }}
          ref={(el) => {
            if (el) {
              el.checked = checked;
              el.indeterminate = isIndeterminate;
            }
          }}
        />
        <label for={id}>{name}</label>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        {children.length > 0 &&
          children.map((items) => (
            <Checkbox node={items} handleChange={handleChange} />
          ))}
      </div>
    </div>
  );
};

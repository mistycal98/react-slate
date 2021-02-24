import React from "react";
import { useEditor, useReadOnly, ReactEditor } from "slate-react";
import { Transforms } from "slate";

const CheckListItemElement = ({ attributes, children, element }) => {
  const editor = useEditor();
  const readOnly = useReadOnly();
  const { checked } = element;
  return (
    <div
      {...attributes}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <span
        contentEditable={false}
        style={{
          marginRight: "0.75em",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              checked: event.target.checked,
            };
            Transforms.setNodes(editor, newProperties, { at: path });
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          flex: "1",
          opacity: `${checked ? 0.666 : 1}`,
          textDecoration: `${checked ? "line-through" : "none"}`,
        }}
      >
        {children}
      </span>
    </div>
  );
};
export default CheckListItemElement;

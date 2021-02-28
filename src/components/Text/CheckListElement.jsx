import React from "react";
import { useEditor, useReadOnly, ReactEditor } from "slate-react";
import { Editor, Point, Transforms, Element as SlateElement } from "slate";

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

export const withChecklists = (editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "check-list-item",
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties = {
            type: "paragraph",
          };
          Transforms.setNodes(editor, newProperties, {
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "check-list-item",
          });
          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};

export default CheckListItemElement;

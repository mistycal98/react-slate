import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { Editor, Transforms, Range, Point, createEditor, Element as SlateElement } from "slate";
import { withHistory } from "slate-history";
import CheckListItemElement from "../../components/Text/CheckListElement";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "mod+m": "checklist",
};

// const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichTextExample = () => {
  // InitailState
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "First Line is Alway Reserved for Heading 👆" }],
    },
    {
      type: "check-list-item",
      checked: false,
      children: [{ text: "Integrate with RichText Editor" }],
    },
  ]);

  // Rendering Elememts
  const renderElement = useCallback((props) => <Element {...props} />, []);

  // Rendering Leaf Elememts : Selection
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Defining Editor for editable
  const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), []);

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <h1
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          margin: "1rem auto",
          textAlign: "center",
          outline: " 0px solid transparent",
          minHeight: "2rem",
        }}
      >
        {value[0].children[0].text}
      </h1>

      <Editable
        style={{
          boxShadow: "0px 4px 8px 0px grey",
          padding: "1rem 1rem",
          minHeight: "500px",
          width: "500px",
          margin: "auto",
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          console.log(event.key);
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    // case "block-quote":
    //   return <blockquote {...attributes}>{children}</blockquote>;
    // case "bulleted-list":
    //   return <ul {...attributes}>{children}</ul>;
    // case "heading-one":
    //   return <h1 {...attributes}>{children}</h1>;
    // case "heading-two":
    //   return <h2 {...attributes}>{children}</h2>;
    // case "list-item":
    //   return <li {...attributes}>{children}</li>;
    // case "numbered-list":
    //   return <ol {...attributes}>{children}</ol>;
    case "check-list-item":
      return <CheckListItemElement element={element}>{children}</CheckListItemElement>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const withChecklists = (editor) => {
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

export default RichTextExample;

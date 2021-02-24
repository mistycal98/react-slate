import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, useEditor } from "slate-react";
import { Editor, Transforms, Range, Point, createEditor, Element as SlateElement, Text } from "slate";
import { withHistory } from "slate-history";

// Module Import
import CheckListItemElement from "../../components/Text/CheckListElement";
import escapeHtml from "escape-html";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "alt+c": "checklist",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichTextExample = () => {
  // InitailState
  const [value, setValue] = useState([
    {
      type: "heading-one",
      children: [{ text: "" }],
    },
  ]);

  // Rendering Elements
  const renderElement = useCallback((props) => <Element {...props} />, []);

  // Rendering Leaf Elememts : Selection
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Defining Editor for editable
  const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), []);

  // Serialize Action
  const serialize = (node) => {
    if (Text.isText(node)) {
      return node.text;
    }
    // const children = node.children?.map((n) => serialize(n)).join("");

    const children = node.map((v) => v.children.map((n) => serialize(n)).join(" "));
    const [type] = node.map((v) => v.type);
    console.log(type);
    switch (type) {
      case "quote":
        return `<blockquote><p>${children}</p></blockquote>`;
      case "paragraph":
        return `<p>${children}</p>`;
      case "link":
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      case "block-quote":
        return `<blockquote>${children}</blockquote>`;
      case "bulleted-list":
        return `<ul>${children}</ul>`;
      case "heading-one":
        return `<h1>${children}</h1>`;
      case "heading-two":
        return `<h2>${children}</h2>`;
      case "list-item":
        return `<li>${children}</li>`;
      case "numbered-list":
        return `<ol>${children}</ol>`;
      case "check-list-item":
        return `<div>Checklist div</div>`;
      default:
        return `<p>${children}</p>`;
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <div>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="check-list-item" icon="checklist" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <button type="button" onClick={() => console.log(serialize(value))}>
          Save
        </button>
      </div>
      {/* <input type="text"/> */}
      {/* <h1>{value[0].children[0].text}</h1> */}
      <Editable
        style={{
          // boxShadow: "0px 4px 8px 0px grey",
          // padding: "1rem 1rem",
          // minHeight: "500px",
          // width: "500px",
          margin: "1rem 3rem",
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Start Typing...."
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          // console.log(event.key);
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
        onKeyPress={(event) => {
          console.log(value);
          if (event.code === "Enter" && value.length === 1) {
            console.log("Exc");
            Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "", bold: false }] });
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
  // HTML Serializing

  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
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

const BlockButton = ({ format, icon }) => {
  const editor = useEditor();
  return (
    <button
      style={{
        padding: "0.2rem",
        margin: "0.2rem",
      }}
      type="button"
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useEditor();
  return (
    <button
      style={{
        margin: "0.2rem",
        padding: "0.2rem",
      }}
      type="button"
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

export default RichTextExample;

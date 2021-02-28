import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate } from "slate-react";
import { Transforms, createEditor, Element as SlateElement, Text, Node } from "slate";
import { withHistory } from "slate-history";

// Module Import
import Leaf from "../../components/Text/Leaf";
import Element from "../../components/Text/Element";

import { BlockButton, MarkButton, toggleMark } from "./Toolbar";
import { serializeNode } from "./serialize";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "alt+c": "checklist",
};

const RichTextExample = () => {
  // InitailState
  const [value, setValue] = useState([
    {
      type: "title",
      children: [{ text: "" }],
    },
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const withLayout = (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]) => {
      if (path.length === 0) {
        if (editor.children.length < 1) {
          const title = { type: "title", children: [{ text: "Untitled" }] };
          Transforms.insertNodes(editor, title, { at: path.concat(0) });
        }

        if (editor.children.length < 2) {
          const paragraph = { type: "paragraph", children: [{ text: "" }] };
          Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
        }

        for (const [child, childPath] of Node.children(editor, path)) {
          const type = childPath[0] === 0 ? "title" : "paragraph";

          if (SlateElement.isElement(child) && child.type !== type) {
            const newProperties = { type };
            Transforms.setNodes(editor, newProperties, { at: childPath });
          }
        }
      }

      return normalizeNode([node, path]);
    };

    return editor;
  };

  // Rendering Elements
  const renderElement = useCallback((props) => <Element {...props} />, []);

  // Rendering Leaf Elememts : Selection
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Defining Editor for editable
  const editor = useMemo(() => withLayout(withHistory(withReact(createEditor()))), []);

  const Save = () => {
    // console.log(value[0].type, value[0].children[0].text.trim().length);
    if (value[0].type === "title" && value[0].children[0].text.trim().length === 0) {
      alert("Enter Title");
    }
  };

  return (
    <>
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
          <button type="button" onClick={Save}>
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
      <div dangerouslySetInnerHTML={{ __html: serializeNode(value) }}></div>
    </>
  );
};

export default RichTextExample;

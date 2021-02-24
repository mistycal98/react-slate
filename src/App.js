import React from "react";

// Slate JS Components
// import TextComponent from "./features/richTextEditor/Text";
import RichTextExample from "./features/richTextEditor/RichText";
// import Serialize from "./features/richTextEditor/Serialize";
// import CheckListsExample from "./features/richTextEditor/Checklist.js";
import HtmlSerialize from "./features/richTextEditor/HtmlSerialize";

function App() {
  const onSave = (slateValue) => console.log(slateValue)
  return (
    <div>
      {/* <TextComponent /> */}
      <RichTextExample onSave={onSave} />
      {/* <CheckListsExample /> */}
      {/* <Serialize /> */}
      {/* <HtmlSerialize nodes={[{"type":"paragraph","children":[{"text":"ssdfsdfsdf","bold":true}]},{"type":"paragraph","children":[{"text":"","bold":false}]},{"type":"paragraph","children":[{"text":"safsdfsdf","bold":false}]},{"type":"check-list-item","children":[{"text":"svsjnjksdnsf","bold":false}]},{"type":"check-list-item","children":[{"text":"sfsdf","bold":false}]},{"type":"check-list-item","children":[{"text":"sdfsdf","bold":false}]},{"type":"numbered-list","children":[{"type":"list-item","children":[{"text":"sdsfsdf","bold":false}]}]},{"type":"bulleted-list","children":[{"type":"list-item","children":[{"text":"sdfs","bold":false}]},{"type":"list-item","children":[{"text":"sdssddf","bold":false,"code":true}]},{"type":"list-item","children":[{"text":"sfsdfsdfsdfsd","bold":false,"code":true,"underline":true}]},{"type":"list-item","children":[{"text":"sfsd","bold":false,"underline":true,"code":true}]}]}]}/> */}
    </div>
  );
}

export default App;

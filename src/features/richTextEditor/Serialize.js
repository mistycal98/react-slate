import React, { useState } from "react";
import escapeHtml from "escape-html";
import { Node, Text } from "slate";

const Serialize = () => {
  const [nodes, setnodes] = useState([
    {
      type: "paragraph",
      children: [{ text: "An opening paragraph..." }],
    },
    {
      type: "quote",
      children: [{ text: "A wise quote." }],
    },
    {
      type: "paragraph",
      children: [{ text: "A closing paragraph!" }],
    },
  ]);

  // Serialize -----> To Plain Text
  const normalSerialize = (value) => {
    return value.map((n) => Node.string(n)).join("\n");
  };

  // Serialize to HTML using escape-html package

  console.log(normalSerialize(nodes));
//   let newchar = escapeHtml(nodes);

//   console.log(JSON.stringify(newchar));
  
  return <div>Hello World</div>;
};

export default Serialize;

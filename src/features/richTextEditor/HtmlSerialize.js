import React, { useState } from "react";
import escapeHtml from "escape-html";
import { Text } from "slate";
import CheckListItemElement from "../../components/Text/CheckListElement";

const HtmlSerialize = ({ nodes }) => {
  //   const [nodes, setNodes] = useState([
  //     {
  //       type: "paragraph",
  //       children: [{ text: "An opening paragraph..." }],
  //     },
  //     {
  //       type: "quote",
  //       children: [{ text: "A wise quote." }],
  //     },
  //     {
  //       type: "paragraph",
  //       children: [{ text: "A closing paragraph!" }],
  //     },
  //   ]);

  //   let result = escapeHtml(nodes);
  //   console.log(result);

  const serialize = (node) => {
    if (Text.isText(node)) {
      // return node.text;
      return escapeHtml(node.text);
    }

    const children = node?.children?.map((n) => serialize(n)).join("");

    switch (node.type) {
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
      //   case "check-list-item":
      // return <CheckListItemElement element={node}>{children}</CheckListItemElement>;
      default:
        return `<p>${children}</p>`;
    }
  };
  const htmlnode = nodes.map((node) => serialize(node)).join("");
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlnode }} />
    </>
  );
};

export default HtmlSerialize;

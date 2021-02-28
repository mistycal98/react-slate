import escapeHTML from "escape-html";
import { Text } from "slate";

// Serialize Action
export const serializeNode = (node) => {
  console.log(node);
  if (Text?.isText(node)) {
    return escapeHTML(node.text);
  }
  // const children = node.children?.map((n) => serialize(n)).join("");

  const children = node?.childen?.map((child) => serializeNode(child)).join("");
  switch (node.type) {
    case "title":
      return `<title>${children}</title>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
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
      return `<checklist>${children}</checklist>`;
    default:
      return `<div>${children}</div>`;
  }
};

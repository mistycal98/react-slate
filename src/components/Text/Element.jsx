import CheckListItemElement from "./CheckListElement";

const Element = ({ attributes, children, element }) => {
  // HTML Serializing

  switch (element.type) {
    case "title":
      return <h2>{children}</h2>;
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

export default Element;

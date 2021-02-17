import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";

// Code Blocks
import CodeElement from "../../components/CodeElement";
import DefaultElement from "../../components/DefaultElement";

const TextComponent = () => {
	const editor = useMemo(() => withReact(createEditor()), []);
	const [value, setValue] = useState([
		{
			type: "paragraph",
			children: [{ text: "Start Entering text" }],
		},
	]);

	const renderElement = useCallback((props) => {
		switch (props.element.type) {
			case "code":
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	return (
		<div>
			<h1>Slate Text Editor</h1>
			<Slate
				editor={editor}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			>
				<Editable
					renderElement={renderElement}
					onKeyDown={(event) => {
						if (!event.ctrlKey) {
							return;
						}

						switch (event.key) {
							// When "`" is pressed, keep our existing code block logic.
							case "`": {
								event.preventDefault();
								const [match] = Editor.nodes(editor, {
									match: (n) => n.type === "code",
								});
								Transforms.setNodes(
									editor,
									{ type: match ? "paragraph" : "code" },
									{ match: (n) => Editor.isBlock(editor, n) }
								);
								break;
							}

							// When "B" is pressed, bold the text in the selection.
							case "b": {
								event.preventDefault();
								Transforms.setNodes(
									editor,
									{ bold: true },
									// Apply it to text nodes, and split the text node up if the
									// selection is overlapping only part of it.
									{ match: (n) => Text.isText(n), split: true }
								);
								break;
							}
							default:
								break;
						}
					}}
				/>
			</Slate>
		</div>
	);
};

export default TextComponent;

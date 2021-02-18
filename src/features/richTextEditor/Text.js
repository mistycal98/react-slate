import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";

// Code Blocks
import CodeElement from "../../components/Text/CodeElement";
import DefaultElement from "../../components/Text/DefaultElement";

// Importing Leaf component
import Leaf from "../../components/Text/Leaf";

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

	const renderLeaf = useCallback((props) => {
		return <Leaf {...props} />;
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
					renderLeaf={renderLeaf}
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
									{ italic: true },
									{ match: (n) => Text.isText(n), split: true }
								);
								break;
							}

							// Italic Case
							case "i":
								event.preventDefault();
								Transforms.setNodes(
									editor,
									{ bold: true },
									{ match: (n) => Text.isText(n), split: true }
								);
								break;
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

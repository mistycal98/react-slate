import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";

// Code Blocks
import CodeElement from "../../components/CodeElement";
import DefaultElement from "../../components/DefaultElement";

const Text = () => {
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
						if (event.key === "`" && event.ctrlKey) {
							// Prevent the "`" from being inserted by default.
							event.preventDefault();
							// Otherwise, set the currently selected blocks type to "code".
							Transforms.setNodes(
								editor,
								{ type: "code" },
								{ match: (n) => Editor.isBlock(editor, n) }
							);
						}
					}}
				/>
			</Slate>
		</div>
	);
};

export default Text;

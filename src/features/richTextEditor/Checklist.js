import React, { useState, useMemo, useCallback } from "react";
import {
	Slate,
	Editable,
	withReact,
	useEditor,
	useReadOnly,
	ReactEditor,
} from "slate-react";
import {
	Editor,
	Transforms,
	Range,
	Point,
	createEditor,
	Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";

const CheckListsExample = () => {
	const [value, setValue] = useState([
		{
			type: "check-list-item",
			checked: false,
			children: [{ text: "Integrate with RichText Editor" }],
		},
	]);
	const renderElement = useCallback((props) => <Element {...props} />, []);
	const editor = useMemo(
		() => withChecklists(withHistory(withReact(createEditor()))),
		[]
	);

	return (
		<Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
			<Editable
				renderElement={renderElement}
				placeholder="Get to work…"
				spellCheck
				autoFocus
			/>
		</Slate>
	);
};

const withChecklists = (editor) => {
	const { deleteBackward } = editor;

	editor.deleteBackward = (...args) => {
		const { selection } = editor;

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n) =>
					!Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					n.type === "check-list-item",
			});

			if (match) {
				const [, path] = match;
				const start = Editor.start(editor, path);

				if (Point.equals(selection.anchor, start)) {
					const newProperties = {
						type: "paragraph",
					};
					Transforms.setNodes(editor, newProperties, {
						match: (n) =>
							!Editor.isEditor(n) &&
							SlateElement.isElement(n) &&
							n.type === "check-list-item",
					});
					return;
				}
			}
		}

		deleteBackward(...args);
	};

	return editor;
};

const Element = (props) => {
	const { attributes, children, element } = props;

	switch (element.type) {
		case "check-list-item":
			return <CheckListItemElement {...props} />;
		default:
			return <p {...attributes}>{children}</p>;
	}
};

const CheckListItemElement = ({ attributes, children, element }) => {
	const editor = useEditor();
	const readOnly = useReadOnly();
	const { checked } = element;
	return (
		<div
			{...attributes}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<span
				contentEditable={false}
				style={{
					marginRight: "0.75em",
				}}
			>
				<input
					type="checkbox"
					checked={checked}
					onChange={(event) => {
						const path = ReactEditor.findPath(editor, element);
						const newProperties = {
							checked: event.target.checked,
						};
						Transforms.setNodes(editor, newProperties, { at: path });
					}}
				/>
			</span>
			<span
				contentEditable={!readOnly}
				suppressContentEditableWarning
				style={{
					flex: "1",
					opacity: `${checked ? 0.666 : 1}`,
					textDecoration: `${checked ? "line-through" : "none"}`,
				}}
			>
				{children}
			</span>
		</div>
	);
};

export default CheckListsExample;

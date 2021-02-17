import React, { useState } from "react";

const TextLogic = () => {
	const [title, setTitle] = useState();

	return (
		<div
			style={{
				margin: "10px",
			}}
		>
			{/* <h1>{title}</h1> */}

			<input
				type="text"
				value={title}
				onChange={(e) => {
					setTitle(e.target);
				}}
			/>
		</div>
	);
};

export default TextLogic;

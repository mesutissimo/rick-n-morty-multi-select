import React from "react";

const BolderText = ({ text, bolder }: { text: string; bolder: string }) => {
	const splitted = text.split("");
	const regex = new RegExp(bolder, "ig");
	const matches = text.matchAll(regex);
	let matchIndexes: number[] = [];

	[...matches].forEach((m: RegExpMatchArray) => {
		const idx = Array.from({ length: m[0].length }, (_, index) =>
			m?.index ? m.index + index : index
		);
		matchIndexes = [...matchIndexes, ...idx];
	});

	return splitted.map((s, i) => (
		<React.Fragment key={i}>
			{matchIndexes.includes(i) ? <strong>{s}</strong> : s}
		</React.Fragment>
	));
};

export default BolderText;

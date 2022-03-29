export const buildTree = ({ columns, columnIndex, parent }) => {
	let children = [];
	if (columns[columnIndex]) {
		columns[columnIndex].forEach((cell) => {
			children.push(
				buildTree({
					columns,
					columnIndex: columnIndex + 1,
					parent: cell,
				})
			);
		});
	}

	if (!parent) {
		return {
			...children[0],
			isExpanded: false,
		};
	}

	return {
		name: parent,
		isExpanded: true,
		children,
	};
};

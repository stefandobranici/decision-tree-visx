import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { buildTree } from "../../lib/utils";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinearGradient } from "@visx/gradient";
import { pointRadial } from "d3-shape";
import useForceUpdate from "./useForceUpdate";
import getLinkComponent from "./getLinkComponent";

interface TreeNode {
	name: string;
	type?: string;
	isExpanded?: boolean;
	children?: TreeNode[];
}

const margin = { top: 30, left: 30, right: 30, bottom: 70 };

const dataTest = {
	name: "Renault Clio",
	type: "C",
	children: [
		{
			name: "What type of activity are we doing?",
			type: "Q",
			children: [
				{
					name: "Prospecting",
					type: "C",
					children: [
						{
							name: "What group does the user fit into?",
							type: "Q",
							children: [
								{
									name: "Demographic",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "12",
												},
											],
										},
									],
								},
								{
									name: "Competitor",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "22",
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					name: "Retargeting",
					type: "C",
					children: [
						{
							name: "What group does the user fit into?",
							type: "Q",
							children: [
								{
									name: "Example 1",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "5",
												},
											],
										},
									],
								},
								{
									name: "Example 2",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "3",
												},
											],
										},
									],
								},
								{
									name: "Example 3",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "4",
												},
											],
										},
									],
								},
								{
									name: "Example 4",
									children: [
										{
											name: "What type of user are they?",
											children: [
												{
													name: "10",
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

const TreeViewer = ({ width, height }) => {
	const [tree, setTree] = useState<TreeNode>(dataTest);
	const { CSVReader } = useCSVReader();
	const forceUpdate = useForceUpdate();

	const [layout, setLayout] = useState<string>("cartesian");
	const [orientation, setOrientation] = useState<string>("horizontal");
	const [linkType, setLinkType] = useState<string>("step");
	const [stepPercent, setStepPercent] = useState<number>(0.1);

	const handleImport = (result) => {
		// remove first 3 headers from csv imported data
		const data = result.data.slice(3);

		let transposedColumns = [];
		transposedColumns[0] = [];
		transposedColumns[0][0] = "Region";

		data.forEach((row) => {
			row.forEach((cell, columnIndex) => {
				if (!!cell) {
					if (!transposedColumns[columnIndex + 1]) {
						transposedColumns[columnIndex + 1] = [];
					}

					transposedColumns[columnIndex + 1].push(cell);
				}
			});
		});

		const tree = buildTree({
			columns: transposedColumns,
			columnIndex: 0,
			parent: undefined,
		});

		setTree(tree);
	};

	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const origin = { x: 0, y: 0 };
	const sizeWidth = innerHeight;
	const sizeHeight = innerWidth;

	const LinkComponent = getLinkComponent({ layout, linkType, orientation });

	return (
		<div>
			{
				// Uncomment if you want csv reader
				/* <Flex p="4">
				<Heading mr="8">Decision Tree</Heading>
				<CSVReader onUploadAccepted={handleImport}>
					{({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
						<Box>
							<Button colorScheme="teal" size="md" {...getRootProps()}>
								Upload CSV
							</Button>
							<Text>{acceptedFile && acceptedFile.name}</Text>
						</Box>
					)}
				</CSVReader>
			</Flex> */
			}
			{!tree ? null : (
				<svg width={width} height={height}>
					<LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
					<Group>
						<Tree
							root={hierarchy(tree, (d) => (d.isExpanded ? null : d.children))}
							size={[sizeWidth, sizeHeight]}
							separation={(a, b) => (a.parent === b.parent ? 1 : 1) / a.depth}
						>
							{(tree) => (
								<Group top={origin.y} left={origin.x + 40}>
									{tree.links().map((link, i) => (
										<LinkComponent
											key={i}
											data={link}
											percent={0.5}
											stroke="rgb(152,152,152,0.6)"
											strokeWidth="2"
											fill="none"
										/>
									))}

									{tree.descendants().map((node, key) => {
										const width = 20 + node.data.name.length * 8;
										const height = 40;

										const top = node.x;
										const left = node.y;

										return (
											<Group top={top} left={left} key={key}>
												<rect
													height={height}
													width={width}
													y={-height / 2}
													x={-width / 2}
													fill={node.data.type == "C" ? "none" : "#272b4d"}
													stroke={
														node.data.type == "C"
															? "none"
															: node.data.children
															? "#03c0dc"
															: "#26deb0"
													}
													strokeWidth={1}
													strokeDasharray={node.data.children ? "0" : "2,2"}
													strokeOpacity={node.data.children ? 1 : 0.6}
													rx={node.data.children ? 0 : 10}
													onClick={() => {
														node.data.isExpanded = !node.data.isExpanded;
														console.log(node);
														forceUpdate();
													}}
												/>
												<text
													height={height}
													width={width}
													dy=".33em"
													fontSize={13}
													fontFamily="Arial"
													textAnchor="middle"
													style={{ pointerEvents: "none" }}
													fill={
														node.data.type === "C"
															? "#black"
															: node.children
															? "#26deb0"
															: "#26deb0"
													}
												>
													{node.data.name}
												</text>
											</Group>
										);
									})}
								</Group>
							)}
						</Tree>
					</Group>
				</svg>
			)}
		</div>
	);
};

export default TreeViewer;

import { render } from "react-dom";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import TreeViewer from "./components/decision-tree/TreeViewer";
import "./index.css";

const React = require("react");

render(
	<ParentSize>
		{({ width, height }) => <TreeViewer width={width} height={height} />}
	</ParentSize>,
	document.getElementById("root")
);

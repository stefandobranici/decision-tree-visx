export interface Version {
	id: string;
	version: string;
}

export interface Root {
	id: string;
	clientId: string;
	client: string;
	name: string;
	versions: Version[];
}

export interface Tree {
	id: string;
	rootId: string;
	children: Node[];
}

export type NodeType =
	| "CAMPAIGN"
	| "MARKET"
	| "AUDIENCE"
	| "AUDIENCE_TYPE"
	| "EXTERNAL"
	| "SUBTREE"
	| "PRODUCT"
	| "GENERIC";

export interface Node {
	id: string;
	type: NodeType;
	value: string;
	name: string;
	parent: string;
	subTree: string;
}

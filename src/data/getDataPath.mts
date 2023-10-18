import { existsSync, mkdirSync } from "fs";

function cleanRelative(path: string): string {
	while (["", ".", "..", "data"].includes(path.split("/")[0])) {
		path = path.split("/").slice(1).join("/");
	}
	return path;
}

function cleanPath(path: string): string {
	return path.replace(/\/+/g, "/");
}

/** If a dir is given, it will create the dir if it doesn't yet exist. */
export function getDataPath(relative?: string): string {
	const root = existsSync("../data") ? "../data" : "./data";
	if (relative) {
		const path = cleanPath(`${root}/${cleanRelative(relative)}`);
		const dir = path.split("/").slice(0, -1).join("/");
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive:true });
		}
		return path;
	}
	return root;
}
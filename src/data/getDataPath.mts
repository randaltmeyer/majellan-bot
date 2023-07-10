import { existsSync, mkdirSync } from "fs";

/** If a dir is given, it will create the dir if it doesn't yet exist. */
export function getDataPath(dir?: string): string {
	const root = existsSync("./data") ? "./data" : "../data";
	if (dir) {
		const path = root + "/" + dir;
		if (!existsSync(path)) {
			mkdirSync(path);
		}
		return path;
	}
	return root;
}
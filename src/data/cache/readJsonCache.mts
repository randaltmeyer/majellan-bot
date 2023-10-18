import { existsSync, readFileSync } from "fs";
import { error, verbose } from "../../utils/logger.mjs";

type Options = {
	skipReadCache?: boolean;
	cacheFilePath?: string;
};

export function readJsonCache<T>({ skipReadCache, cacheFilePath }: Options = { }): T | null {
	if (skipReadCache !== true && cacheFilePath) {
		try {
			if (existsSync(cacheFilePath)) {
				verbose(`Reading cache: ${cacheFilePath}`);
				const raw = readFileSync(cacheFilePath, "utf8");
				return raw ? JSON.parse(raw) : null;
			}
		}catch(ex) {
			error("Error reading cache: " + cacheFilePath);
		}
	}
	return null;
}
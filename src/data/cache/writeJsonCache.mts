import { mkdirSync, writeFileSync } from "fs";
import { error, verbose } from "../../utils/logger.mjs";

type Options = {
	skipWriteCache?: boolean;
	cacheFilePath?: string;
};

export function writeJsonCache<T>(json: T, { skipWriteCache, cacheFilePath }: Options = { }): void {
	if (skipWriteCache !== true && cacheFilePath) {
		try {
			verbose(`Writing cache: ${cacheFilePath}`);
			const cacheDirPath = cacheFilePath.split("/").slice(0, -1).join("/");
			mkdirSync(cacheDirPath, { recursive:true });
			writeFileSync(cacheFilePath, JSON.stringify(json));
		}catch(ex) {
			error("Error writing cache: " + cacheFilePath);
		}
	}
}
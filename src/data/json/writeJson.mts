import { mkdirSync, writeFileSync } from "fs";
import { error, verbose } from "../../utils/logger.mjs";

type Options = {
	skipWrite?: boolean;
	filePath?: string;
};

export function writeJson<T>(json: T, { skipWrite, filePath }: Options = { }): void {
	if (skipWrite !== true && filePath && json) {
		try {
			verbose(`Writing JSON: ${filePath}`);
			const cacheDirPath = filePath.split("/").slice(0, -1).join("/");
			mkdirSync(cacheDirPath, { recursive:true });
			writeFileSync(filePath, typeof(json) === "string" ? json : JSON.stringify(json));
		}catch(ex) {
			error("\tError: " + filePath);
		}
	}
}
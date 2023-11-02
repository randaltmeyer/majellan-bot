import { mkdirSync, writeFileSync } from "fs";
import { error, verbose } from "../../utils/logger.mjs";
import { formattedStringify } from "./formattedStringify.mjs";

type Options = {
	skipWrite?: boolean;
	filePath?: string;
	pretty?: boolean;
};

export function writeJson<T>(json: T, { skipWrite, filePath, pretty }: Options = { }): void {
	if (skipWrite !== true && filePath && json) {
		try {
			verbose(`Writing JSON: ${filePath}`);
			const cacheDirPath = filePath.split("/").slice(0, -1).join("/");
			mkdirSync(cacheDirPath, { recursive:true });
			let out = json as string;
			if (typeof(json) !== "string") {
				out = pretty ? formattedStringify(json) : JSON.stringify(json);
			}
			writeFileSync(filePath, out);
		}catch(ex) {
			error("\tError: " + filePath);
		}
	}
}
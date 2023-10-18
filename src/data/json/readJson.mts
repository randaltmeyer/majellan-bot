import { existsSync, readFileSync } from "fs";
import { error, verbose } from "../../utils/logger.mjs";

type Options = {
	skipRead?: boolean;
	filePath?: string;
};

export function readJson<T>({ skipRead, filePath }: Options = { }): T | null {
	if (skipRead !== true && filePath) {
		try {
			if (existsSync(filePath)) {
				verbose(`Reading cache: ${filePath}`);
				const raw = readFileSync(filePath, "utf8");
				return raw ? JSON.parse(raw) : null;
			}
		}catch(ex) {
			error("\tError: " + filePath);
		}
	}
	return null;
}
import { error, verbose } from "../../utils/logger.mjs";
import { fetchToFile } from "./fetchToFile.mjs";
import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

export async function fetchToJsonDb(url: string, filePath: string): Promise<void> {
	await fetchToFile(url, filePath).catch(error);
	verbose(`Checking JSON for Array: ${filePath} ...`);
	const json = readJson({ filePath});
	if (Array.isArray(json)) {
		verbose(`Converting JSON to .db format: ${filePath} ...`);
		writeJson(json.map(obj => JSON.stringify(obj)).join("\n"), { filePath });
	}
}
import { errorReturnNull } from "../../utils/logger.mjs";
import { fetchJson } from "./fetchJson.mjs";
import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

type Options = {
	skipRead?: boolean;
	skipWrite?: boolean;
	filePath?: string;
};

export async function getOrFetchJson<T = any>(url: string, options?: Options): Promise<T | null> {
	const cache = readJson<T>(options);
	if (cache) {
		return cache;
	}

	const json = await fetchJson<T>(url).catch(errorReturnNull);
	if (json) {
		writeJson(json, options);
	}

	return json;
}
import { errorReturnNull } from "../../utils/logger.mjs";
import { fetchJson } from "./fetchJson.mjs";
import { readJsonCache } from "../cache/readJsonCache.mjs";
import { writeJsonCache } from "../cache/writeJsonCache.mjs";

type Options = {
	skipReadCache?: boolean;
	skipWriteCache?: boolean;
	cacheFilePath?: string;
};

export async function getOrFetchJson<T = any>(url: string, options?: Options): Promise<T | null> {
	const cache = readJsonCache<T>(options);
	if (cache) {
		return cache;
	}

	const json = await fetchJson<T>(url).catch(errorReturnNull);
	if (json) {
		writeJsonCache(json, options);
	}

	return json;
}
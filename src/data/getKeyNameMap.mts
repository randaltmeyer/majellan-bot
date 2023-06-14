import { Lang } from "../types.mjs";
import { readJson } from "./readJson.mjs";

const maps = new Map<Lang, Map<string, string>>();

/**
 * Gets the map for the given lang, reading from file if it hasn't been loaded yet.
 * @returns the string/string map for the given lang
 */
export function getKeyNameMap(lang: Lang = "en"): Map<string, string> {
	if (!maps.has(lang)) {
		const map = new Map();
		const profile = readJson("units/name", lang);
		if (profile) {
			Object.keys(profile).forEach(key => map.set(key, profile[key]));
		}
		const stage = readJson("stage", lang);
		if (stage) {
			Object.keys(stage).forEach(key => map.set(key, stage[key]));
		}
		maps.set(lang, map);
	}
	return maps.get(lang)!;
}
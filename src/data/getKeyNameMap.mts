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

		const dataSets = ["units/name", "items/name", "stage"];
		dataSets.forEach(dataSet => {
			const data = readJson(dataSet as "stage", lang);
			if (data) {
				Object.keys(data).forEach(key => map.set(key, data[key]));
			}
		});

		maps.set(lang, map);
	}
	return maps.get(lang)!;
}
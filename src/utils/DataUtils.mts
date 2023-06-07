import { readFileSync } from "fs";
import { BotInfo, DropInfo, Fetch, Lang, StringStringMap, UnitInfo } from "../types.mjs";

function readJson(type: "bot", file: "dev"): BotInfo | null;
function readJson(type: "profile", file: Lang): StringStringMap | null;
function readJson(type: "stage", file: Lang): StringStringMap | null;
function readJson(type: "unit", file: "all"): UnitInfo[] | null;
function readJson(type: "drop", file: "all"): DropInfo[] | null;
function readJson(type: "fetch", file: "all"): Fetch[] | null;
function readJson<T>(type: string, file: string): T | null {
	const path = type === "fetch" ? `../data/fetches.json` : `../data/${type}s/${file}.json`;
	const contents = readFileSync(path, "utf8");
	try { return JSON.parse(contents); }catch(ex) { console.error(ex); }
	return null;
}

export function getBotToken(): string {
	return readJson("bot", "dev")?.token ?? "";
}
export function getFetches(): Fetch[] {
	return readJson("fetch", "all") ?? [];
}

const maps = new Map<Lang, Map<string, string>>();

/**
 * Gets the map for the given lang, reading from file if it hasn't been loaded yet.
 * @returns the string/string map for the given lang
 */
function getMap(lang: Lang = "en"): Map<string, string> {
	if (!maps.has(lang)) {
		const map = new Map();
		const profile = readJson("profile", lang);
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

function findKeyOrValue(key: string, value: string, lang?: Lang): string | null {
	const map = getMap(lang);
	if (key) {
		return map.get(key) ?? null;
	}
	if (value) {
		const entries = map.entries();
		const regex = new RegExp(`^${value}$`, "i");
		for (const entry of entries) {
			if (regex.test(entry[1])) {
				return entry[0];
			}
		}
	}
	return null;
}

export function findByKey(key: string, lang?: Lang) { return findKeyOrValue(key, "", lang); }

export function findByValue(value: string, lang?: Lang) { return findKeyOrValue("", value, lang); }

export function findUnit(unitKey: string, includeDrops: boolean): UnitInfo | null {
	const all = readJson("unit", "all") ?? [];
	for (const unit of all) {
		if (unit.name === unitKey) {
			if (includeDrops) {
				unit.drops = findDropsByUnit(unitKey);
			}
			return unit;
		}
	}
	return null;
}

export function findDropsByUnit(unitKey: string): DropInfo[] {
	const all = readJson("drop", "all") ?? [];
	const drops: DropInfo[] = [];
	for (const drop of all) {
		if (drop.unitSplit.includes(unitKey)) {
			drops.push(drop);
		}
	}
	return drops;
}
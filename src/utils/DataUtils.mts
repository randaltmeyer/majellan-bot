import { readFileSync } from "fs";
import { BotInfo, DropInfo, Fetch, InfoBase, Lang, StringStringMap, UnitInfo } from "../types.mjs";

function readJson(type: "bots", file: "dev"): BotInfo | null;

function readJson(type: "units/name", file: Lang): StringStringMap | null;
function readJson(type: "stage", file: Lang): StringStringMap | null;

function readJson(type: "ailments", file: "all"): InfoBase[] | null;
function readJson(type: "buffs", file: "all"): InfoBase[] | null;
function readJson(type: "fetches", file: "all"): Fetch[] | null;
function readJson(type: "items", file: "all"): InfoBase[] | null;
function readJson(type: "passives", file: "all"): InfoBase[] | null;
function readJson(type: "skills", file: "all"): InfoBase[] | null;
function readJson(type: "unitdrop", file: "all"): DropInfo[] | null;
function readJson(type: "units", file: "all"): UnitInfo[] | null;
function readJson<T>(type: string, file: string): T | null {
	const path = `../data/${type}/${file}.json`;
	const contents = readFileSync(path, "utf8");
	try { return JSON.parse(contents); }catch(ex) { console.error(ex); }
	return null;
}

export function getBotToken(): string {
	return readJson("bots", "dev")?.token ?? "";
}
export function getFetches(): Fetch[] {
	return readJson("fetches", "all") ?? [];
}

const maps = new Map<Lang, Map<string, string>>();

/**
 * Gets the map for the given lang, reading from file if it hasn't been loaded yet.
 * @returns the string/string map for the given lang
 */
function getMap(lang: Lang = "en"): Map<string, string> {
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

function findKeyOrValue(key: string, value: string, lang?: Lang, partial?: boolean): string | null {
	const map = getMap(lang);
	if (key) {
		return map.get(key) ?? null;
	}
	if (value) {
		const entries = map.entries();
		const regex = new RegExp(partial ? value : `^${value}$`, "i");
		for (const entry of entries) {
			if (regex.test(entry[1])) {
				return entry[0];
			}
		}
	}
	return null;
}

export function findByKey(key: string, lang?: Lang): string | null { return findKeyOrValue(key, "", lang); }

export function findByValue(value: string, lang?: Lang): string | null { return findKeyOrValue("", value, lang); }

export function findAllByValue(value: string, lang?: Lang): string[] {
	const matches: string[] = [];

	const map = getMap(lang);
	const entries = map.entries();

	const regex = new RegExp(value, "i");
	for (const entry of entries) {
		if (regex.test(entry[1])) {
			matches.push(entry[0]);
		}
	}
	return matches;
}

export function findUnit(unitKey: string, includeDrops: boolean): UnitInfo | null {
	const all = readJson("units", "all") ?? [];
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
	const all = readJson("unitdrop", "all") ?? [];
	const drops: DropInfo[] = [];
	for (const drop of all) {
		if (drop.unitSplit.includes(unitKey)) {
			drops.push(drop);
		}
	}
	return drops;
}
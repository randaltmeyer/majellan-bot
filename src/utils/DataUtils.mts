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

export const UNRELEASED_SUPER = "⁰";
export const DROP_SUPER = "¹";
export const BATTLE_ROAD_SUPER = "²";

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
		const specialChars = /[\\^$.*+?()[\]{}|]/g;
		const regexSafeValue = value.replace(specialChars, char => "\\" + char);
		const regexString = partial ? regexSafeValue : `^${regexSafeValue}$`;
		const regex = new RegExp(regexString, "i");
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

export function normalize(value: string | null): string | null {
	return value ? value
			.replace(/[\u2018\u2019]/g, `'`)
			.replace(/[\u201C\u201D]/g, `"`)
			.replace(/[\u2013\u2014]/g, `-`)
		: value;
}

const _allUnits: UnitInfo[] = [];
export function getAllUnits(): UnitInfo[] {
	if (!_allUnits.length) {
		const allUnits = readJson("units", "all") ?? [];
		allUnits.forEach(unit => {
			const nameByKey = normalize(findByKey(unit.name)) ?? unit.name;
			unit.cleanName = nameByKey.replace(/\*/, "");
			unit.notedName = nameByKey.replace(/\*/, UNRELEASED_SUPER);
			unit.drops = findDropsByUnit(unit);
			if (!unit.battleRoads) unit.battleRoads = [];
			if (unit.drops.length) unit.notedName += DROP_SUPER;
			if (unit.battleRoads?.length) unit.notedName += BATTLE_ROAD_SUPER;
			_allUnits.push(unit);
		});
	}
	return _allUnits;
}

export function findUnit(unitKey: string): UnitInfo | null {
	return getAllUnits().find(unit => unit.name === unitKey) ?? null;
}

const _allDropInfo: DropInfo[] = [];
function getAllDropInfo(): DropInfo[] {
	if (!_allDropInfo.length) {
		const allDropInfo = readJson("unitdrop", "all") ?? [];
		_allDropInfo.push(...allDropInfo);
	}
	return _allDropInfo;
}
function findDropsByUnit(unit: UnitInfo): DropInfo[] {
	const drops: DropInfo[] = [];
	const unitKey = unit.name;
	const allDropInfo = getAllDropInfo();
	for (const drop of allDropInfo) {
		if (drop.unitSplit.includes(unitKey)) {
			drops.push(drop);
		}
	}
	return drops;
}

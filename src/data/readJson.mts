import { readFileSync } from "fs";
import { BotInfo, DropInfo, Fetch, InfoBase, Item, ItemInfo, Lang, StringStringMap, Unit, UnitInfo } from "../types.mjs";
import { AlliesAlmanacCore } from "./AlliesAlmanac.mjs";
import { getDataPath } from "./getDataPath.mjs";

export function readJson(type: "almanacs", file: string): AlliesAlmanacCore | null;
export function readJson(type: "bots", file: "dev"): BotInfo | null;

export function readJson(type: "units/name", file: Lang): StringStringMap | null;
export function readJson(type: "items/name", file: Lang): StringStringMap | null;
export function readJson(type: "stage", file: Lang): StringStringMap | null;

export function readJson(type: "fetches", file: "all"): Fetch[] | null;

export function readJson(type: "ailments", file: "raw"): InfoBase[] | null;
export function readJson(type: "buffs", file: "raw"): InfoBase[] | null;
export function readJson(type: "items", file: "raw"): ItemInfo[] | null;
export function readJson(type: "passives", file: "raw"): InfoBase[] | null;
export function readJson(type: "skills", file: "raw"): InfoBase[] | null;
export function readJson(type: "unitdrop", file: "raw"): DropInfo[] | null;
export function readJson(type: "units", file: "raw"): UnitInfo[] | null;

export function readJson(type: "units", file: "all"): Unit[] | null;
export function readJson(type: "items", file: "all"): Item[] | null;

export function readJson<T>(type: string, file: string): T | null {
	const dataPath = getDataPath();
	const path = `${dataPath}/${type}/${file}.json`;
	const contents = readFileSync(path, "utf8");
	try { return JSON.parse(contents); }catch(ex) { console.error(ex); }
	return null;
}

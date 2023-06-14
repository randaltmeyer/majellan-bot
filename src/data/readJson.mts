import { readFileSync } from "fs";
import { BotInfo, DropInfo, Fetch, InfoBase, Lang, StringStringMap, UnitInfo } from "../types.mjs";

export function readJson(type: "bots", file: "dev"): BotInfo | null;

export function readJson(type: "units/name", file: Lang): StringStringMap | null;
export function readJson(type: "stage", file: Lang): StringStringMap | null;

export function readJson(type: "ailments", file: "all"): InfoBase[] | null;
export function readJson(type: "buffs", file: "all"): InfoBase[] | null;
export function readJson(type: "fetches", file: "all"): Fetch[] | null;
export function readJson(type: "items", file: "all"): InfoBase[] | null;
export function readJson(type: "passives", file: "all"): InfoBase[] | null;
export function readJson(type: "skills", file: "all"): InfoBase[] | null;
export function readJson(type: "unitdrop", file: "all"): DropInfo[] | null;
export function readJson(type: "units", file: "all"): UnitInfo[] | null;

export function readJson<T>(type: string, file: string): T | null {
	const path = `../data/${type}/${file}.json`;
	const contents = readFileSync(path, "utf8");
	try { return JSON.parse(contents); }catch(ex) { console.error(ex); }
	return null;
}

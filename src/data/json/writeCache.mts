import { Family, Rank, Role, Unit } from "../../types.mjs";
import { clearMemCache } from "./getAll.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { writeJson } from "./writeJson.mjs";

export function writeCache(data: Family[], type: "family"): void;
export function writeCache(data: Rank[], type: "rank"): void;
export function writeCache(data: Role[], type: "role"): void;
export function writeCache(data: Unit[], type: "unit"): void;
export function writeCache<T>(data: T[], type: "family" | "rank" | "role" | "unit"): void {
	const filePath = getDataPath(`${type}.json`);
	writeJson(data, { filePath });
	clearMemCache(type);
}
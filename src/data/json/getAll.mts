import { Area, Family, Farmable, Item, Rank, Role, Unit } from "../../types.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { readJson } from "./readJson.mjs";

type TypeKey = "area" | "farmable" | "item" | "unit" | "family" | "rank" | "role";
type DataType = Area | Farmable | Item | Unit | Family | Rank | Role;

const memCache = new Map<TypeKey, DataType[]>();

export function getAll(type: "area"): Area[];
export function getAll(type: "farmable"): Farmable[];
export function getAll(type: "item"): Item[];
export function getAll(type: "unit"): Unit[];
export function getAll(type: "family"): Family[];
export function getAll(type: "rank"): Rank[];
export function getAll(type: "role"): Role[];
export function getAll(type: TypeKey): DataType[] {
	if (type === "item") return [];
	if (!memCache.has(type)) {
		const filePath = getDataPath(`${type}.json`);
		const data = readJson<DataType[]>({ filePath }) ?? [];
		memCache.set(type, data);
	}
	return memCache.get(type)!;
}

export function clearMemCache(type?: TypeKey): void {
	if (type) {
		const array = memCache.get(type);
		if (array) {
			array.length = 0;
		}
		memCache.delete(type);
	}else {
		memCache.forEach(value => value.length = 0);
		memCache.clear();
	}
}
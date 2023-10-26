import { Accolade, Area, AreaGroup, Farmable, Shop, Stage, Tnt, Unit } from "../../types.mjs";
import { RawEquipment } from "../units/RawEquipment.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { readJson } from "./readJson.mjs";

type TypeKey = "accolade" | "area" | "area_group" | "equipment" | "farmable" | "shop" | "stage" | "tnt" | "unit";

const memCache = new Map<TypeKey, any[]>();

export function getAll(type: "accolade"): Accolade[];
export function getAll(type: "area"): Area[];
export function getAll(type: "area_group"): AreaGroup[];
export function getAll(type: "equipment"): RawEquipment[];
export function getAll(type: "farmable"): Farmable[];
export function getAll(type: "shop"): Shop[];
export function getAll(type: "stage"): Stage[];
export function getAll(type: "tnt"): Tnt[];
export function getAll(type: "unit"): Unit[];
export function getAll<T>(type: TypeKey): T[] {
	if (!memCache.has(type)) {
		const filePath = getDataPath(`${type}.json`);
		const data = readJson<T[]>({ filePath }) ?? [];
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
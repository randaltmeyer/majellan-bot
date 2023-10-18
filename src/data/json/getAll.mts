import { Area, Farmable, Unit } from "../../types.mjs";
import { RawEquipment } from "../units/RawEquipment.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { readJson } from "./readJson.mjs";

type TypeKey = "area" | "farmable" | "equipment" | "unit";
type DataType = Area | Farmable | RawEquipment | Unit;

const memCache = new Map<TypeKey, DataType[]>();

export function getAll(type: "area"): Area[];
export function getAll(type: "farmable"): Farmable[];
export function getAll(type: "equipment"): RawEquipment[];
export function getAll(type: "unit"): Unit[];
export function getAll(type: TypeKey): DataType[] {
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
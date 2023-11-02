import { Accolade, Area, AreaGroup, Farmable, Shop, Tnt } from "../../types.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";
import { errorReturnArray } from "../../utils/logger.mjs";
import { RawEquipment } from "../equipment/RawEquipment.mjs";
import { RawStage } from "../stages/RawStage.mjs";
import { RawUnit } from "../units/RawUnit.mjs";
import { clearMemCache } from "./getAll.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { getOrFetchJson } from "./getOrFetchJson.mjs";

type FetchableType = "accolade" | "area" | "area_group" | "equipment" | "farmable" | "unit" | "shop" | "stage" | "tnt";

function rawType(type: FetchableType): string {
	switch(type) {
		case "unit": return "rawUnit";
		case "stage": return "rawStage";
		default: return type;
	}
}

export async function getOrFetch(type: "accolade"): Promise<Accolade[]>;
export async function getOrFetch(type: "area"): Promise<Area[]>;
export async function getOrFetch(type: "area_group"): Promise<AreaGroup[]>;
export async function getOrFetch(type: "equipment"): Promise<RawEquipment[]>;
export async function getOrFetch(type: "farmable"): Promise<Farmable[]>;
export async function getOrFetch(type: "shop"): Promise<Shop[]>;
export async function getOrFetch(type: "stage"): Promise<RawStage[]>;
export async function getOrFetch(type: "tnt"): Promise<Tnt[]>;
export async function getOrFetch(type: "unit"): Promise<RawUnit[]>;
export async function getOrFetch<T>(type: FetchableType): Promise<T[]> {
	const url = `https://drackyknowledge.com/api/${type}`;
	const filePath = getDataPath(`${rawType(type)}.json`);
	const skipRead = !isDevMode();
	const data = await getOrFetchJson(url, { filePath, skipRead }).catch(errorReturnArray);
	if (type !== "unit") {
		clearMemCache(type);
	}
	return data;
}
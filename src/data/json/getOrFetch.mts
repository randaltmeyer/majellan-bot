import { Area, Farmable } from "../../types.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";
import { errorReturnArray } from "../../utils/logger.mjs";
import { RawEquipment } from "../units/RawEquipment.mjs";
import { RawUnit } from "../units/RawUnit.mjs";
import { clearMemCache } from "./getAll.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { getOrFetchJson } from "./getOrFetchJson.mjs";

type FetchableType = "area" | "farmable" | "equipment" | "rawUnit";

export async function getOrFetch(type: "area"): Promise<Area[]>;
export async function getOrFetch(type: "farmable"): Promise<Farmable[]>;
export async function getOrFetch(type: "equipment"): Promise<RawEquipment[]>;
export async function getOrFetch(type: "rawUnit"): Promise<RawUnit[]>;
export async function getOrFetch<T>(type: FetchableType): Promise<T[]> {
	const prefix = type === "rawUnit" ? "unit" : type;
	const url = `https://drackyknowledge.com/api/${prefix}`;
	const filePath = getDataPath(`${type}.json`);
	const skipRead = !isDevMode();
	const data = await getOrFetchJson(url, { filePath, skipRead }).catch(errorReturnArray);
	if (type !== "rawUnit") {
		clearMemCache(type);
	}
	return data;
}
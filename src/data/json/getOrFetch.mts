import { Area, Farmable, Item, Unit } from "../../types.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";
import { errorReturnArray } from "../../utils/logger.mjs";
import { clearMemCache } from "./getAll.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { getOrFetchJson } from "./getOrFetchJson.mjs";

type FetchableType = "area" | "farmable" | "item" | "unit";

export async function getOrFetch(type: "area"): Promise<Area[]>;
export async function getOrFetch(type: "farmable"): Promise<Farmable[]>;
export async function getOrFetch(type: "item"): Promise<Item[]>;
export async function getOrFetch(type: "unit"): Promise<Unit[]>;
export async function getOrFetch<T>(type: FetchableType): Promise<T[]> {
	if (type === "item") return [];
	const suffix = ["farmable", "unit"].includes(type) ? "majellan_bot" : "";
	const url = `https://drackyknowledge.com/api/${type}/${suffix}`;
	const filePath = getDataPath(`${type}.json`);
	const skipRead = !isDevMode();
	const data = await getOrFetchJson(url, { filePath, skipRead }).catch(errorReturnArray);
	clearMemCache(type);
	return data;
}
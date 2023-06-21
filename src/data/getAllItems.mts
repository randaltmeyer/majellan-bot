import { Item } from "../types.mjs";
import { readJson } from "./readJson.mjs";

const _allItems: Item[] = [];

export function getAllItems(): Item[] {
	if (!_allItems.length) {
		_allItems.push(...(readJson("items", "all") ?? []));
	}
	return _allItems;
}

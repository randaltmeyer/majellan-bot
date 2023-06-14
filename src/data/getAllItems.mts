import { ItemInfo } from "../types.mjs";
import { UNRELEASED_SUPER } from "../types.mjs";
import { normalizeString } from "../utils/normalizeString.mjs";
import { readJson } from "./readJson.mjs";
import { findKeyOrValue } from "./findKeyOrValue.mjs";

const _allItems: ItemInfo[] = [];

export function getAllItems(): ItemInfo[] {
	if (!_allItems.length) {
		const allItems = readJson("items", "all") ?? [];
		allItems.forEach(item => {
			if (!item.key) {
				item.key = item.name;
				item.name = normalizeString(findKeyOrValue(item.key)) ?? item.key;
				item.cleanName = item.name.replace(/\*/, "");
				item.notedName = item.name.replace(/\*/, UNRELEASED_SUPER);
				item.units = [];
			}
			_allItems.push(item);
		});
	}
	return _allItems;
}

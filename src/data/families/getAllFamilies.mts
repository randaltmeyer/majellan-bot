import { readJsonCache } from "../cache/readJsonCache.mjs";
import { getDataPath } from "../getDataPath.mjs";
import { Family } from "./Family.mjs";

const _allFamilies: Family[] = [];

export function getAllFamilies(): Family[] {
	if (!_allFamilies.length) {
		const cacheFilePath = getDataPath(`families.json`);
		const allFamilies = readJsonCache<Family[]>({ cacheFilePath }) ?? [];
		_allFamilies.push(...allFamilies);
	}
	return _allFamilies;
}

export function clearFamiliesCache(): void {
	_allFamilies.length = 0;
}

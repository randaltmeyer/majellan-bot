import { readJsonCache } from "../cache/readJsonCache.mjs";
import { getDataPath } from "../getDataPath.mjs";
import { Rank } from "./Rank.mjs";

const _allRanks: Rank[] = [];

export function getAllRanks(): Rank[] {
	if (!_allRanks.length) {
		const cacheFilePath = getDataPath(`ranks.json`);
		const allRanks = readJsonCache<Rank[]>({ cacheFilePath }) ?? [];
		_allRanks.push(...allRanks);
	}
	return _allRanks;
}

export function clearRanksCache(): void {
	_allRanks.length = 0;
}

import { readJsonCache } from "../cache/readJsonCache.mjs";
import { getDataPath } from "../getDataPath.mjs";
import { Unit } from "./Unit.mjs";

const _allUnits: Unit[] = [];

export function getAllUnits(): Unit[] {
	if (!_allUnits.length) {
		const cacheFilePath = getDataPath(`units.json`);
		const allUnits = readJsonCache<Unit[]>({ cacheFilePath }) ?? [];
		_allUnits.push(...allUnits);
	}
	return _allUnits;
}

export function clearUnitsCache(): void {
	_allUnits.length = 0;
}

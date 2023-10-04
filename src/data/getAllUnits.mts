import { Unit } from "../types.mjs";
import { readJson } from "./readJson.mjs";

const _allUnits: Unit[] = [];

export function getAllUnits(): Unit[] {
	if (!_allUnits.length) {
		_allUnits.push(...readJson("units", "all") ?? []);
	}
	return _allUnits;
}

export function clearUnitsCache(): void {
	_allUnits.length = 0;
}
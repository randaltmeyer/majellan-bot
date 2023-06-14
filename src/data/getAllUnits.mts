import { InfoBase, UnitInfo } from "../types.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../types.mjs";
import { normalizeString } from "../utils/normalizeString.mjs";
import { findDropsByUnit } from "./findDropsByUnit.mjs";
import { readJson } from "./readJson.mjs";
import { findKeyOrValue } from "./findKeyOrValue.mjs";

const _allUnits: UnitInfo[] = [];

function findWeapon(unit: UnitInfo): InfoBase | undefined {
	// if (unit.cleanName === "Hero Solo") {
	// 	const skills = unit.passives?.map(p => p.passive?.boost?.skill?.name);
	// 	console.log(skills);
	// }
	unit;
	return undefined;
}

export function getAllUnits(): UnitInfo[] {
	if (!_allUnits.length) {
		const allUnits = readJson("units", "all") ?? [];
		allUnits.forEach(unit => {
			if (!unit.key) {
				unit.key = unit.name;
				unit.name = normalizeString(findKeyOrValue(unit.key)) ?? unit.key;
				unit.cleanName = unit.name.replace(/\*/, "");
				unit.notedName = unit.name.replace(/\*/, UNRELEASED_SUPER);
				if (!unit.drops?.length) unit.drops = findDropsByUnit(unit.key);
				if (unit.drops.length) unit.notedName += DROP_SUPER;
				if (!unit.battleRoads?.length) unit.battleRoads = [];
				if (unit.battleRoads?.length) unit.notedName += BATTLE_ROAD_SUPER;
				unit.weapon = findWeapon(unit);
			}
			_allUnits.push(unit);
		});
	}
	return _allUnits;
}

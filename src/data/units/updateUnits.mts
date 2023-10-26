import { BATTLE_ROAD_SUPER, DROP_SUPER, ITEM_SUPER, UNRELEASED_SUPER, Unit } from "../../types.mjs";
import { PercentLogger } from "../../utils/PercentLogger.mjs";
import { clearMemCache } from "../json/getAll.mjs";
import { getDataPath } from "../json/getDataPath.mjs";
import { getOrFetch } from "../json/getOrFetch.mjs";
import { writeJson } from "../json/writeJson.mjs";
import { convertUnit } from "./convertUnit.mjs";
import { findAndFormatBattleRoads, hasBattleRoads } from "./findAndFormatBattleRoads.mjs";
import { findAndFormatEquipment, hasEquipment } from "./findAndFormatEquipment.mjs";
import { findAndFormatFarmables, hasFarmables } from "./findAndFormatFarmables.mjs";

export async function updateUnits(): Promise<Unit[]> {
	// await getOrFetch("accolade");
	const areas = await getOrFetch("area");
	// await getOrFetch("area_group");
	const equipment = await getOrFetch("equipment");
	const farmables = await getOrFetch("farmable");
	// await getOrFetch("shop");
	// await getOrFetch("stage");
	// await getOrFetch("tnt");
	const rawUnits = await getOrFetch("unit");

	const pLogger = new PercentLogger(`Converting Units`, rawUnits.length);
	const units = rawUnits.map(rawUnit => {
		const unit = convertUnit(rawUnit);
		unit.notes = "";
		if (unit.name.includes("*")) {
			unit.notes += UNRELEASED_SUPER;
		}
		if (hasFarmables(unit.name, farmables)) {
			unit.notes += DROP_SUPER;
			unit.farmQuests = findAndFormatFarmables(unit.name, farmables);
		}
		if (hasBattleRoads(unit.name, areas)) {
			unit.notes += BATTLE_ROAD_SUPER;
			unit.battleRoads = findAndFormatBattleRoads(unit.name, areas);
		}
		if (hasEquipment(unit.skillNames, equipment)) {
			unit.notes += ITEM_SUPER;
			unit.equipment = findAndFormatEquipment(unit.skillNames, equipment);
		}

		pLogger.increment();
		return unit;
	});

	writeJson(units, { filePath:getDataPath(`unit.json`) });

	clearMemCache();

	return units;
}

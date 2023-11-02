import { BATTLE_ROAD_SUPER, DROP_SUPER, ITEM_SUPER, UNRELEASED_SUPER, Unit } from "../types.mjs";
import { PercentLogger } from "../utils/PercentLogger.mjs";
import { clearMemCache } from "./json/getAll.mjs";
import { getDataPath } from "./json/getDataPath.mjs";
import { getOrFetch } from "./json/getOrFetch.mjs";
import { writeJson } from "./json/writeJson.mjs";
import { convertStage } from "./stages/convertStage.mjs";
import { convertUnit } from "./units/convertUnit.mjs";
import { findAndFormatBattleRoads, hasBattleRoads } from "./units/findAndFormatBattleRoads.mjs";
import { findAndFormatEquipment, hasEquipment } from "./units/findAndFormatEquipment.mjs";
import { findAndFormatFarmables, hasFarmables, hasStages } from "./units/findAndFormatFarmables.mjs";
import { findAndFormatShopGoods, hasShopGoods } from "./units/findAndFormatShopGoods.mjs";

export async function updateData(): Promise<Unit[]> {
	// await getOrFetch("accolade");
	const areas = await getOrFetch("area");
	// await getOrFetch("area_group");
	const equipment = await getOrFetch("equipment");
	const farmables = await getOrFetch("farmable");
	// await getOrFetch("lootgroup");
	const shops = await getOrFetch("shop");
	const rawStages = await getOrFetch("stage");
	// await getOrFetch("tnt");
	const rawUnits = await getOrFetch("unit");

	const stages = PercentLogger.map(`Converting Stages`, rawStages, rawStage => {
		const stage = convertStage(rawStage);
		return stage;
	});

	const units = PercentLogger.map(`Converting Units`, rawUnits, rawUnit => {
		const unit = convertUnit(rawUnit);
		unit.notes = "";
		if (unit.name.includes("*")) {
			unit.notes += UNRELEASED_SUPER;
		}
		if (hasFarmables(unit.name, farmables) || hasStages(unit.name, stages)) {
			unit.notes += DROP_SUPER;
			unit.farmQuests = findAndFormatFarmables(unit.name, farmables, stages);
		}
		if (hasShopGoods(unit.name, shops)) {
			unit.shopGoods = findAndFormatShopGoods(unit.name, shops);
		}
		if (hasBattleRoads(unit.name, areas)) {
			unit.notes += BATTLE_ROAD_SUPER;
			unit.battleRoads = findAndFormatBattleRoads(unit.name, areas);
		}
		if (hasEquipment(unit.skillNames, equipment)) {
			unit.notes += ITEM_SUPER;
			unit.equipment = findAndFormatEquipment(unit.skillNames, equipment);
		}
		return unit;
	});

	writeJson(stages, { filePath:getDataPath(`stage.json`), pretty:true });
	writeJson(units, { filePath:getDataPath(`unit.json`), pretty:true });

	clearMemCache();

	return units;
}

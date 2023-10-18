import { BATTLE_ROAD_SUPER, DROP_SUPER, Family, ITEM_SUPER, Rank, Role, UNRELEASED_SUPER, Unit } from "../../types.mjs";
import { PercentLogger } from "../../utils/PercentLogger.mjs";
import { clearMemCache } from "../json/getAll.mjs";
import { getOrFetch } from "../json/getOrFetch.mjs";
import { writeCache } from "../json/writeCache.mjs";
import { hasBattleRoads } from "./findAndFormatBattleRoads.mjs";
import { hasFarmables } from "./findAndFormatFarmables.mjs";
import { hasItems } from "./findAndFormatItems.mjs";

export async function updateUnits(): Promise<Unit[]> {
	const areas = await getOrFetch("area");
	const farmables = await getOrFetch("farmable");
	const items = await getOrFetch("item");
	const units = await getOrFetch("unit");
	const families: Family[] = [];
	const ranks: Rank[] = [];
	const roles: Role[] = [];

	const pLogger = new PercentLogger(`Converting Units`, units.length);
	units.forEach(unit => {
		if (unit.family_icon && !families.find(family => family.name === unit.family)) {
			families.push({ name:unit.family, icon:unit.family_icon });
		}
		if (unit.unit_rank_icon && !ranks.find(rank => rank.name === unit.unit_rank)) {
			ranks.push({ name:unit.unit_rank, icon:unit.unit_rank_icon });
		}
		if (unit.role_icon && !roles.find(role => role.name === unit.role)) {
			roles.push({ name:unit.role, icon:unit.role_icon });
		}
		delete unit.small_family_icon;
		delete unit.family_icon;
		delete unit.unit_rank_icon;
		delete unit.role_icon;

		unit.notes = "";
		if (unit.display_name.includes("*")) {
			unit.notes += UNRELEASED_SUPER;
		}
		if (hasFarmables(unit.display_name, farmables)) {
			unit.notes += DROP_SUPER;
		}
		if (hasBattleRoads(unit.display_name, areas)) {
			unit.notes += BATTLE_ROAD_SUPER;
		}
		if (hasItems(unit.display_name, items)) {
			unit.notes += ITEM_SUPER;
		}

		pLogger.increment();
		return unit;
	});

	writeCache(families, "family");
	writeCache(ranks, "rank");
	writeCache(roles, "role");
	writeCache(units, "unit");

	clearMemCache();

	return units;
}

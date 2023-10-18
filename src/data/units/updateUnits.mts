import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../../types.mjs";
import { PercentLogger } from "../../utils/PercentLogger.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";
import { errorReturnArray } from "../../utils/logger.mjs";
import { Area } from "../areas/Area.mjs";
import { findAndFormatBattleRoads } from "../areas/findAndFormatBattleRoads.mjs";
import { writeJsonCache } from "../cache/writeJsonCache.mjs";
import { Family } from "../families/Family.mjs";
import { Farmable } from "../farmables/Farmable.mjs";
import { findAndFormatFarmables } from "../farmables/findAndFormatFarmables.mjs";
import { getOrFetchJson } from "../fetch/getOrFetchJson.mjs";
import { getDataPath } from "../getDataPath.mjs";
import { Item } from "../items/Item.mjs";
import { Rank } from "../ranks/Rank.mjs";
import { Role } from "../roles/Role.mjs";
import { Unit } from "./Unit.mjs";
import { clearUnitsCache } from "./getAllUnits.mjs";


async function getOrFetch<T>(type: "area" | "farmable" | "item" | "unit"): Promise<T[]> {
	const suffix = ["farmable", "unit"].includes(type) ? "majellan_bot" : "";
	const url = `https://drackyknowledge.com/api/${type}/${suffix}`;
	const cacheFilePath = getDataPath(`${type}s.json`);
	const skipReadCache = !isDevMode();
	return getOrFetchJson(url, { cacheFilePath, skipReadCache }).catch(errorReturnArray);
}

function writeCache(data: Family[], type: "families"): void;
function writeCache(data: Rank[], type: "ranks"): void;
function writeCache(data: Role[], type: "roles"): void;
function writeCache(data: Unit[], type: "units"): void;
function writeCache<T>(data: T[], type: "families" | "ranks" | "roles" | "units"): void {
	const cacheFilePath = getDataPath(`${type}.json`);
	writeJsonCache(data, { cacheFilePath });
}

export async function updateUnits(): Promise<Unit[]> {
	const areas = await getOrFetch<Area>("area");
	const farmables = await getOrFetch<Farmable>("farmable");
	const items = [] as Item[];//await getOrFetch<Item>("item");
	const units = await getOrFetch<Unit>("unit");
	const families: Family[] = [];
	const ranks: Rank[] = [];
	const roles: Role[] = [];

	const pLogger = new PercentLogger(`Converting Units`, units.length);
	units.forEach(unit => {
		delete unit.small_family_icon;
		if (unit.family_icon && !families.find(family => family.name === unit.family)) {
			families.push({ name:unit.family, icon:unit.family_icon });
			delete unit.family_icon;
		}
		if (unit.unit_rank_icon && !ranks.find(rank => rank.name === unit.unit_rank)) {
			ranks.push({ name:unit.unit_rank, icon:unit.unit_rank_icon });
			delete unit.unit_rank_icon;
		}
		if (unit.role_icon && !roles.find(role => role.name === unit.role)) {
			roles.push({ name:unit.role, icon:unit.role_icon });
			delete unit.role_icon;
		}

		unit.notes = "";

		pLogger.increment();
		unit.battleRoads = findAndFormatBattleRoads(areas, unit.display_name);
		unit.farmQuests = findAndFormatFarmables(farmables, unit.display_name);
		if (unit.display_name.includes("*")) {
			unit.notes += UNRELEASED_SUPER;
		}
		if (unit.farmQuests.length) {
			unit.notes += DROP_SUPER;
		}
		if (unit.battleRoads.length) {
			unit.notes += BATTLE_ROAD_SUPER;
		}
		unit.items = items.map(item => item.id);
		return unit;
	});

	writeCache(families, "families");
	writeCache(ranks, "ranks");
	writeCache(roles, "roles");
	writeCache(units, "units");

	clearUnitsCache();

	return units;
}

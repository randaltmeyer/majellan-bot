import { Unit } from "../../types.mjs";
import { normalizeString } from "../../utils/normalizeString.mjs";
import { getAll } from "../json/getAll.mjs";
import { findAndFormatBattleRoads } from "./findAndFormatBattleRoads.mjs";
import { findAndFormatFarmables } from "./findAndFormatFarmables.mjs";
import { findAndFormatItems } from "./findAndFormatItems.mjs";

export type FindUnitsResponse = {
	content: string;
	cleanContent: string;
	byName?: Unit;
	also: Unit[];
	byPartialName: Unit[];
	closest?: Unit;
};

export function findUnits(content: string): FindUnitsResponse {
	// clean the input to match better
	const cleanContent = normalizeString(content);

	const ranks = getAll("rank");
	const roles = getAll("role");
	const families = getAll("family");

	// perform partial match
	const partialNameRegex = new RegExp(cleanContent, "i");
	const byPartialName = getAll("unit")
		.filter(unit => partialNameRegex.test(unit.display_name))
		.map<Unit>(unit => {
			const battleRoads = findAndFormatBattleRoads(unit.display_name);
			const farmQuests = findAndFormatFarmables(unit.display_name);
			const items = findAndFormatItems(unit.display_name);
			return {
				battleRoads,
				farmQuests,
				items,
				family_icon: families.find(family => unit.family === family.name)?.icon,
				unit_rank_icon: ranks.find(rank => unit.unit_rank === rank.name)?.icon,
				unit_role_icon: roles.find(role => unit.role === role.name)?.icon,
				...unit
			};
		});

	// perform exact match
	const nameRegex = new RegExp(`^${cleanContent}$`, "i");
	const byName = byPartialName.find(unit => nameRegex.test(unit.display_name));

	// get closest match: an exact match or a partial if no exact and only 1 partial match exists
	const closest = byName ?? (byPartialName.length === 1 ? byPartialName[0] : undefined);

	// get other matches that aren't the closest
	const also = byPartialName.filter(u => u !== closest);

	return { content, cleanContent, byName, also, byPartialName, closest };
}

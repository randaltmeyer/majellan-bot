import { getAllUnits } from "./getAllUnits.mjs";
import { normalizeString } from "../../utils/normalizeString.mjs";
import { getAllRanks } from "../ranks/getAllRanks.mjs";
import { getAllRoles } from "../roles/getAllRoles.mjs";
import { getAllFamilies } from "../families/getAllFamilies.mjs";

export function findUnits(content: string) {
	// clean the input to match better
	const cleanContent = normalizeString(content);

	const ranks = getAllRanks();
	const roles = getAllRoles();
	const families = getAllFamilies();

	// perform partial match
	const partialNameRegex = new RegExp(cleanContent, "i");
	const byPartialName = getAllUnits()
		.filter(unit => partialNameRegex.test(unit.display_name))
		.map(unit => ({
			family_icon: families.find(family => unit.family === family.name)?.icon,
			unit_rank_icon: ranks.find(rank => unit.unit_rank === rank.name)?.icon,
			unit_role_icon: roles.find(role => unit.role === role.name)?.icon,
			...unit
		}));

	// perform exact match
	const nameRegex = new RegExp(`^${cleanContent}$`, "i");
	const byName = byPartialName.find(unit => nameRegex.test(unit.display_name));

	// get closest match: an exact match or a partial if no exact and only 1 partial match exists
	const closest = byName ?? (byPartialName.length === 1 ? byPartialName[0] : undefined);

	// get other matches that aren't the closest
	const also = byPartialName.filter(u => u !== closest);

	return { content, cleanContent, byName, also, byPartialName, closest };
}

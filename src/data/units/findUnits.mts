import { Unit } from "../../types.mjs";
import { normalizeString } from "../../utils/normalizeString.mjs";
import { getAll } from "../json/getAll.mjs";

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

	// perform partial match
	const partialNameRegex = new RegExp(cleanContent, "i");
	const byPartialName = getAll("unit").filter(unit => partialNameRegex.test(unit.name));

	// perform exact match
	const nameRegex = new RegExp(`^${cleanContent}$`, "i");
	const byName = byPartialName.find(unit => nameRegex.test(unit.name));

	// get closest match: an exact match or a partial if no exact and only 1 partial match exists
	const closest = byName ?? (byPartialName.length === 1 ? byPartialName[0] : undefined);

	// get other matches that aren't the closest
	const also = byPartialName.filter(u => u !== closest);

	return { content, cleanContent, byName, also, byPartialName, closest };
}

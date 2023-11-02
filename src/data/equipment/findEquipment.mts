import { normalizeString } from "../../utils/normalizeString.mjs";
import { getAll } from "../json/getAll.mjs";
import { FindResponse } from "../FindResponse.mjs";

export function findEquipment(content: string): FindResponse<"Equipment"> {
	// clean the input to match better
	const cleanContent = normalizeString(content);

	// perform partial match
	const partialNameRegex = new RegExp(cleanContent, "i");
	const byPartialName = getAll("equipment").filter(eq => partialNameRegex.test(eq.equipment_display_name));

	// perform exact match
	const nameRegex = new RegExp(`^${cleanContent}$`, "i");
	const byName = byPartialName.find(eq => nameRegex.test(eq.equipment_display_name));

	// get closest match: an exact match or a partial if no exact and only 1 partial match exists
	const closest = byName ?? (byPartialName.length === 1 ? byPartialName[0] : undefined);

	// get other matches that aren't the closest
	const also = byPartialName.filter(u => u !== closest);

	return { type:"Equipment", content, cleanContent, byName, also, byPartialName, closest };
}

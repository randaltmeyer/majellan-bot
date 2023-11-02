import { normalizeString } from "../../utils/normalizeString.mjs";
import { getAll } from "../json/getAll.mjs";
import { FindResponse } from "../FindResponse.mjs";

export function findStage(content: string): FindResponse<"Stage"> {
	// clean the input to match better
	const cleanContent = normalizeString(content);

	// perform partial match
	const partialNameRegex = new RegExp(cleanContent, "i");
	const byPartialName = getAll("stage").filter(stage => partialNameRegex.test(stage.stage_display_name));

	// perform exact match
	const nameRegex = new RegExp(`^${cleanContent}$`, "i");
	const byName = byPartialName.find(stage => nameRegex.test(stage.stage_display_name));

	// get closest match: an exact match or a partial if no exact and only 1 partial match exists
	const closest = byName ?? (byPartialName.length === 1 ? byPartialName[0] : undefined);

	// get other matches that aren't the closest
	const also = byPartialName.filter(u => u !== closest);

	return { type:"Stage", content, cleanContent, byName, also, byPartialName, closest };
}

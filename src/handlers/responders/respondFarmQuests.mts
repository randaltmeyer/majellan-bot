import { Message } from "discord.js";
import { getAll } from "../../data/json/getAll.mjs";
import { debug } from "../../utils/logger.mjs";

function unique<T>(value: T, index: number, array: T[]) {
	return value && array.indexOf(value) === index;
}

function sortAsString(a: string, b: string): -1 | 0 | 1 {
	if (a !== b) {
		return a < b ? -1 : 1;
	}
	return 0;
}

export async function respondFarmQuests(_message: Message): Promise<void> {
	const farmables = getAll("farmable");
	const groupNames = farmables
		.map(f => f.stage_area_group_name?.replace(/\s*(:\s*(Very Hard|Hard|Normal)|\((Very Hard|Hard|Normal)\))\s*$/, ""))
		.filter(unique)
		.sort(sortAsString);
	// const areaNames = farmables.map(f => f.stage_area_name).filter(unique).sort(sortAsString);
	// const stageNames = farmables.map(f => f.stage_display_name).filter(unique).sort(sortAsString);
	debug({groupNames});
	// debug({areaNames});
	// debug({stageNames});
}
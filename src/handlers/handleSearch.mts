import { Message, userMention } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { findUnits } from "../data/units/findUnits.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../types.mjs";
import { cleanContent } from "../utils/cleanContent.mjs";
import { debug, error } from "../utils/logger.mjs";
import { prepByNameMessageArgs, prepClosestMessageArgs } from "./prepMessageArgs.mjs";
import { getAll } from "../data/json/getAll.mjs";
import { findEquipment } from "../data/units/findEquipment.mjs";
import { FindResponse } from "../data/units/FindResponse.mjs";

async function respondByName(message: Message, findResponse: FindResponse<any>): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(message.author.id);
	const args = prepByNameMessageArgs(almanac, findResponse);
	await message.reply(args);
}

async function respondClosest(message: Message, findResponse: FindResponse<"Unit">): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(message.author.id);
	const args = prepClosestMessageArgs(almanac, findResponse);
	await message.reply(args);
}

async function respondSorry(message: Message, { content, byPartialName }: FindResponse<"Unit">): Promise<void> {
	const sorry = `Sorry, I couldn't find a unit using:\n> ${content}`;
	let but = "";
	let notes = "";

	const byP = byPartialName.length;
	if (byP) {
		const names = byPartialName.map(unit => unit.name + unit.notes);
		but = `\n\nI did find partial match(es):\n> ${names.join(", ")}`;

		const unreleased = but.includes(UNRELEASED_SUPER),
			hasDrops = but.includes(DROP_SUPER),
			hasBattleRoads = but.includes(BATTLE_ROAD_SUPER);
		if (unreleased || hasDrops || hasBattleRoads) {
			notes += "\n";
			if (unreleased) {
				notes += `\n*${UNRELEASED_SUPER} new/unreleased*`;
			}
			if (hasDrops) {
				notes += `\n*${DROP_SUPER} farmable*`;
			}
			if (hasBattleRoads) {
				notes += `\n*${BATTLE_ROAD_SUPER} battle roads*`;
			}
		}
	}
	await message.reply(sorry + but + notes);
}
function unique<T>(value: T, index: number, array: T[]) {
	return value && array.indexOf(value) === index;
}
function sortAsString(a: string, b: string): -1 | 0 | 1 {
	if (a !== b) {
		return a < b ? -1 : 1;
	}
	return 0;
}
async function respondFarmQuests(_message: Message): Promise<void> {
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

export async function handleSearch(message: Message): Promise<void> {
	const content = cleanContent(message);
	if (content.length < 3) {
		const content = `Hello, I can only search for names of 3 or more characters.`;
		await message.reply(content);
		return;
	}
	if (content === "farm") {
		return respondFarmQuests(message);
	}
	try {
		const unitResponse = findUnits(content);
		const equipmentResponse = findEquipment(content);
		if (unitResponse.byName) {
			await respondByName(message, unitResponse);

		}else if (equipmentResponse.byName) {
			const eqName = equipmentResponse.byName.equipment_display_name;
			const relatedUnit = getAll("unit").find(unit => unit.equipment.includes(eqName))?.name;
			await respondByName(message, { ...equipmentResponse, relatedUnit });

		}else if (unitResponse.closest) {
			await respondClosest(message, unitResponse);

		}else {
			await respondSorry(message, unitResponse);
		}
	}catch(ex) {
		error(ex);
		debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while searching!`);
	}
}
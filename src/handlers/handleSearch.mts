import { Message, userMention } from "discord.js";
import { FindUnitsResponse, findUnits } from "../data/units/findUnits.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../types.mjs";
import { cleanContent } from "../utils/cleanContent.mjs";
import { debug, error } from "../utils/logger.mjs";
import { embedPartialUnits } from "./embeds/embedPartialUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";

async function respondByName(message: Message, { byName, also }: FindUnitsResponse): Promise<void> {
	const content = `Hello, I found this unit:`;
	const embeds = embedUnit(byName!);
	if (also.length) {
		embeds.push(...embedPartialUnits(also));
	}
	await message.reply({ content, embeds });
}

async function respondClosest(message: Message, { closest }: FindUnitsResponse): Promise<void> {
	const content = `Hello, this is the closest unit I could find:`;
	const embeds = embedUnit(closest!);
	await message.reply({ content, embeds });
}

async function respondSorry(message: Message, { content, byPartialName }: FindUnitsResponse): Promise<void> {
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
				notes += `\n*${DROP_SUPER} recruitable*`;
			}
			if (hasBattleRoads) {
				notes += `\n*${BATTLE_ROAD_SUPER} battle roads*`;
			}
		}
	}
	await message.reply(sorry + but + notes);
}

export async function handleSearch(message: Message): Promise<void> {
	const content = cleanContent(message);
	if (content.length < 3) {
		const content = `Hello, I can only search for names of 3 or more characters.`;
		await message.reply(content);
		return;
	}
	try {
		const response = findUnits(content);
		if (response.byName) {
			await respondByName(message, response);

		}else if (response.closest) {
			await respondClosest(message, response);

		}else {
			await respondSorry(message, response);
		}
	}catch(ex) {
		error(ex);
		debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while searching!`);
	}
}
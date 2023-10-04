import { Message, userMention } from "discord.js";
import { findUnits } from "../data/findUnits.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../types.mjs";
import { cleanContent } from "../utils/cleanContent.mjs";
import { embedPartialUnits } from "./embeds/embedPartialUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";

export async function handleSearch(message: Message): Promise<void> {
	const content = cleanContent(message);
	if (content.length < 3) {
		const content = `Hello, I can only search for names of 3 or more characters.`;
		await message.reply(content);
		return;
	}
	try {
		const units = findUnits(content);
		if (units.byName) {
			const content = `Hello, I found this unit:`;
			const embeds = embedUnit(units.byName);
			if (units.also.length) {
				embeds.push(...embedPartialUnits(units.also));
			}
			message.reply({ content, embeds });

		}else if (units.closest) {
			const content = `Hello, this is the closest unit I could find:`;
			const embeds = embedUnit(units.closest);
			message.reply({ content, embeds });

		}else {
			const sorry = `Sorry, I couldn't find a unit using:\n> ${content}`;
			let but = "";
			let notes = "";

			const byP = units.byPartialName.length;
			if (byP) {
				const names = units.byPartialName.map(unit => unit.name + unit.notes);
				but = `\n\nI did find partial match(es):\n> ${names.join(", ")}`;

				const unreleased = but.includes(UNRELEASED_SUPER),
					hasDrops = but.includes(DROP_SUPER),
					hasBattleRoads = but.includes(BATTLE_ROAD_SUPER);
				if (unreleased || hasDrops || hasBattleRoads) {
					notes += "\n";
					if (unreleased) notes += `\n*${UNRELEASED_SUPER} new/unreleased*`;
					if (hasDrops) notes += `\n*${DROP_SUPER} recruitable*`;
					if (hasBattleRoads) notes += `\n*${BATTLE_ROAD_SUPER} battle roads*`;
				}
			}
			message.reply(sorry + but + notes);
		}
	}catch(ex) {
		console.error(ex);
		console.debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		console.debug(name);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while searching!`);
	}
}
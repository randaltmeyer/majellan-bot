import { Message, userMention } from "discord.js";
import { findUnits } from "../data/findUnits.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../types.mjs";
import { embedUnit } from "./embedUnit.mjs";

export async function handleMessageCreate(message: Message): Promise<void> {
	if (!message.mentions.has("1115758468486397952")) return;
	try {
		const content = message.cleanContent.replace("@DQT Sage", "").trim();
		const units = findUnits(content);
		if (units.byName) {
			const content = `Hello ${userMention(message.author.id)}, I found this unit:`;
			const embeds = await embedUnit(units.byName);
			message.channel.send({ content, embeds });
		}else if (units.closest) {
			const content = `Hello ${userMention(message.author.id)}, this is the closest unit I could find:`;
			const embeds = await embedUnit(units.closest);
			message.channel.send({ content, embeds });
		}else {
			const sorry = `Sorry, I couldn't find a unit using:\n> ${content}`;
			let but = "";
			let notes = "";

			const byP = units.byPartialName.length;
			const byL = units.byLevenshtein.length;
			if (byP || byL) {
				if (byP) {
					const names = units.byPartialName.map(unit => unit.notedName);
					but = `\n\nI did find partial match(es):\n> ${names.join(", ")}`;
				}else {
					const names = units.byLevenshtein.map(unit => unit.notedName);
					but = `\n\nI did find similar name(s):\n> ${names.join(", ")}`;
				}
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
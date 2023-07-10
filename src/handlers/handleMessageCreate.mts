import { Channel, CrosspostedChannel, Message, userMention } from "discord.js";
import { findUnits } from "../data/findUnits.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, Optional, UNRELEASED_SUPER } from "../types.mjs";
import { canRespond } from "../utils/canRespond.mjs";
import { embedPartialUnits } from "./embeds/embedPartialUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";

function getChannelName(channel: Channel | CrosspostedChannel): string | null {
	if ("name" in channel) return channel.name;
	return null;
}

function cleanContent(message: Message): string {
	let content = message.cleanContent;
	scrub("@", "here", "everyone");
	scrub("@", message.mentions.repliedUser?.username);
	message.mentions.roles.forEach(role => scrub("@", role.name));
	message.mentions.users.forEach(user => scrub("@", user.username));
	message.mentions.parsedUsers.forEach(user => scrub("@", user.username));
	message.mentions.members?.forEach(member => scrub("@", member.nickname, member.displayName));
	message.mentions.users.forEach(user => scrub("@", user.username));
	message.mentions.channels.forEach(channel => scrub("#", getChannelName(channel)));
	message.mentions.crosspostedChannels.forEach(channel => scrub("#", getChannelName(channel)));
	return content;

	function scrub(prefix: "@" | "#", ...names: (Optional<string>)[]) {
		names.filter(s => s).forEach(name => content = content.replace(`${prefix}${name}`, ""));
		content = content.replace(/\s+/g, " ").trim();
	}
}

export async function handleMessageCreate(message: Message): Promise<void> {
	if (!canRespond(message)) {
		return;
	}
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
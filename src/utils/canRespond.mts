import { Interaction, Message } from "discord.js";
import { isDevMode } from "./isDevMode.mjs";

const BOT_ID = "1115758468486397952";
const DEV_SERVER_ID = "1118582629424439346";

export function canRespond(messageOrInteraction: Message | Interaction): boolean {
	if (messageOrInteraction.member?.user.bot) {
		return false;
	}
	if (isDevMode()) {
		if (messageOrInteraction.guildId !== DEV_SERVER_ID) {
			return false;
		}
	}
	if ("mentions" in messageOrInteraction) {
		return messageOrInteraction.mentions.has(BOT_ID)
			&& !messageOrInteraction.mentions.everyone;
	}
	if ("customId" in messageOrInteraction) {
		return messageOrInteraction.customId.startsWith(`dqt|almanac|${messageOrInteraction.user.id}`);
	}
	return true;
}
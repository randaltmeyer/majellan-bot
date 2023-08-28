import { Interaction, Message } from "discord.js";
import { isDevMode } from "./isDevMode.mjs";
import { getDevServerId } from "./getDevServerId.mjs";
import { getBotId } from "./getBotId.mjs";

export function canRespond(messageOrInteraction: Message | Interaction): boolean {

	if (messageOrInteraction.member?.user.bot) {
		return false;
	}

	if (isDevMode()) {
		if (messageOrInteraction.guildId !== getDevServerId()) {
			return false;
		}
	}

	if ("mentions" in messageOrInteraction) {
		return messageOrInteraction.mentions.has(getBotId())
			&& !messageOrInteraction.mentions.everyone;
	}

	if ("customId" in messageOrInteraction) {
		return messageOrInteraction.customId.startsWith(`dqt|almanac|${messageOrInteraction.user.id}`);
	}

	return true;
}
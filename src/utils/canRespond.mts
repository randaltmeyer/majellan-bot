import { Interaction, Message } from "discord.js";
import { isDevMode } from "./isDevMode.mjs";
import { getDevServerId } from "./getDevServerId.mjs";
import { getBotId } from "./getBotId.mjs";
import { getDevChannelId } from "./getDevChannelId.mjs";
import { getLiveChannelId } from "./getLiveChannelId.mjs";

export function canRespond(messageOrInteraction: Message | Interaction): boolean {

	if (messageOrInteraction.member?.user.bot) {
		return false;
	}

	const isDevBot = isDevMode();
	if (messageOrInteraction.guildId === getDevServerId()) {
		if (messageOrInteraction.channelId === getDevChannelId() && !isDevBot) {
			return false;
		}
		if (messageOrInteraction.channelId === getLiveChannelId() && isDevBot) {
			return false;
		}
	}else if (isDevBot) {
		return false;
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
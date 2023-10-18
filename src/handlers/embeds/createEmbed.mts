import { EmbedBuilder } from "discord.js";
import { isDevMode } from "../../utils/isDevMode.mjs";

export function createEmbed(title: string): EmbedBuilder {
	const embed = new EmbedBuilder();
	embed.setTitle(title);
	if (isDevMode()) {
		embed.setFooter({ text:"*dev mode*" });
	}
	return embed;
}

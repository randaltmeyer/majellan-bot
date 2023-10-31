import { EmbedBuilder } from "discord.js";
import { isDevMode } from "../../utils/isDevMode.mjs";

export function createEmbed(title: string, includeHome = false): EmbedBuilder {
	const embed = new EmbedBuilder();
	embed.setTitle(title);
	if (includeHome) {
		embed.addFields({ name:"\u200b", value:`[Majellan Bot Home](https://discord.gg/nYwdFTND4E)`, inline:true });
	}
	if (isDevMode()) {
		embed.setFooter({ text:`dev mode` });
	}
	return embed;
}

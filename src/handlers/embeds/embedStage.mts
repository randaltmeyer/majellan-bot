import { EmbedBuilder } from "discord.js";
import { Stage } from "../../types.mjs";
import { createEmbed } from "./createEmbed.mjs";

export function embedStage(stage: Stage): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const embed = createEmbed(`**${stage.stage_display_name}**`, true);
	embeds.push(embed);

	embed.setThumbnail(`https://drackyknowledge.com/${stage.stage_banner_path}`);
	
	return embeds;
}

import { EmbedBuilder } from "discord.js";
import { EMOJI, UNRELEASED_SUPER, Unit } from "../../types.mjs";
import { createEmbed } from "./createEmbed.mjs";

export function embedUnit(unit: Unit, almanac = false): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const embed = createEmbed(`**${unit.display_name}**`);
	embeds.push(embed);

	embed.setThumbnail(`https://drackyknowledge.com/${unit.unit_icon}`);

	const rarity = unit.unit_rank.toLowerCase() as keyof typeof EMOJI;
	const family = unit.family.toLowerCase() as keyof typeof EMOJI;
	const role = unit.role.toLowerCase() as keyof typeof EMOJI;

	let content = `${EMOJI[rarity]} ${EMOJI[family]} ${EMOJI[role]}`;
	if (unit.has_blossom) {
		content += " " + EMOJI.talentBlossom;
	}
	if (unit.has_character_builder) {
		content += " " + EMOJI.characterBuilder;
	}
	content += `\n**Weight:** ${unit.weight}`;
	if (unit.items?.length) {
		content += `\n**Equipment**: ${unit.items.join(", ")}`;
	}
	if (unit.notes.includes(UNRELEASED_SUPER)) {
		content += `\n*unit is new/unreleased*`;
	}
	embed.setDescription(content.trim());

	if (!almanac) {
		if (unit.farmQuests?.length) {
			const farmEmbed = createEmbed("**Recruited From**");
			farmEmbed.setDescription(unit.farmQuests.join("\n"));
			embeds.push(farmEmbed);
		}
		if (unit.battleRoads?.length) {
			const battleRoadEmbed = createEmbed("**Battle Roads**");
			battleRoadEmbed.setDescription(unit.battleRoads.join("\n"));
			embeds.push(battleRoadEmbed);
		}
	}
	return embeds;
}

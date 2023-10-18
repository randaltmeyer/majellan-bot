import { EmbedBuilder } from "discord.js";
import { EMOJI, UNRELEASED_SUPER, Unit } from "../../types.mjs";
import { createEmbed } from "./createEmbed.mjs";

export function embedUnit(unit: Unit, almanac = false): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const embed = createEmbed(`**${unit.name}**`);
	embeds.push(embed);

	embed.setThumbnail(`https://drackyknowledge.com/${unit.icon}`);

	const rarity = unit.rank.toLowerCase() as keyof typeof EMOJI;
	const family = unit.family.toLowerCase() as keyof typeof EMOJI;
	const role = unit.role.toLowerCase() as keyof typeof EMOJI;

	let content = `${EMOJI[rarity]} ${EMOJI[family]} ${EMOJI[role]}`;
	if (unit.hasBlossom) {
		content += " " + EMOJI.talentBlossom;
	}
	if (unit.hasCharacterBuilder) {
		content += " " + EMOJI.characterBuilder;
	}
	content += `\n**Weight:** ${unit.weight}`;
	if (unit.equipment?.length) {
		content += `\n**Equipment**: ${unit.equipment.join(", ")}`;
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

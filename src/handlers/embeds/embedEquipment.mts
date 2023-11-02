import { EmbedBuilder } from "discord.js";
import { EMOJI, Equipment } from "../../types.mjs";
import { createEmbed } from "./createEmbed.mjs";

function roleToEmoji(role: string): string {
	return EMOJI[role.toLowerCase() as keyof typeof EMOJI] ?? role;
}

export function embedEquipment(equipment: Equipment, { almanac = false, farmQuests = true, relatedUnit = "" } ): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const rarity = equipment.equipment_rank.toLowerCase() as keyof typeof EMOJI;

	const embed = createEmbed(`**${equipment.equipment_display_name}** ${EMOJI[rarity]}`, true);
	embeds.push(embed);

	embed.setThumbnail(`https://drackyknowledge.com/${equipment.equipment_icon}`);


	let content = `**Type:** ${equipment.equipment_type}`;
	content += `\n**Category:** ${equipment.equipment_category}`;
	if (equipment.equipment_equipable_roles.length) {
		const roles = equipment.equipment_equipable_roles.map(roleToEmoji);
		content += `\n**Restricted Roles:** ${roles.join(", ")}`;
	}
	if (relatedUnit) {
		content += `\n**Related Unit:** ${relatedUnit}`;
	}
	// content += `\n**Farm Stages:** ${unit.farmQuests?.length ?? 0}`;
	embed.setDescription(content.trim());

	if (!almanac) {
		farmQuests;
		// if (farmQuests && equipment.farmQuests?.length) {
		// 	const farmEmbed = createEmbed("**Farm Stages**");
		// 	farmEmbed.setDescription(unit.farmQuests.join("\n"));
		// 	embeds.push(farmEmbed);
		// }
	}
	
	return embeds;
}

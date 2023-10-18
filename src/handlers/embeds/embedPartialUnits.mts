import { EmbedBuilder } from "discord.js";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER, Unit } from "../../types.mjs";
import { createEmbed } from "./createEmbed.mjs";

export function embedPartialUnits(units: Unit[]): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const embed = createEmbed(`**I also found partial match(es):**`);
	embeds.push(embed);

	const names = units.map(unit => unit.display_name + unit.notes);
	const also = `> ${names.join(", ")}`;
	let notes = "";
	const unreleased = also.includes(UNRELEASED_SUPER),
		hasDrops = also.includes(DROP_SUPER),
		hasBattleRoads = also.includes(BATTLE_ROAD_SUPER);
	if (unreleased || hasDrops || hasBattleRoads) {
		notes += "\n";
		if (unreleased) {
			notes += `\n*${UNRELEASED_SUPER} new/unreleased*`;
		}
		if (hasDrops) {
			notes += `\n*${DROP_SUPER} recruitable*`;
		}
		if (hasBattleRoads) {
			notes += `\n*${BATTLE_ROAD_SUPER} battle roads*`;
		}
	}
	embed.setDescription(also + notes);

	return embeds;
}

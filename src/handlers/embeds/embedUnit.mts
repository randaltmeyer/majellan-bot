import { EmbedBuilder } from "discord.js";
import { UNRELEASED_SUPER } from "../../types.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";
import { Unit } from "../../data/units/Unit.mjs";

const EMOJI = {
	// characterBuilder: "<:998:1118620463527104532>",
	characterBuilder: "<:999:1118621771852157008>",
	// characterBuilder: "<:997:1118676568408084491>",
	talentBlossom: "<:000:1118597460101697556>",
	beast: "<:001:1118599798149365811>",
	demon: "<:002:1118599804843462747>",
	devil: "<:002:1118599804843462747>",
	dragon: "<:003:1118599806416322592>",
	hero: "<:004:1118599813219483708>",
	inorganic: "<:005:1118599814452629584>",
	material: "<:005:1118599814452629584>",
	"???": "<:005:1118599814452629584>",
	mystery: "<:006:1118599815878692964>",
	unknown: "<:006:1118599815878692964>",
	nature: "<:007:1118600211229581345>",
	slime: "<:008:1118600213649686638>",
	undead: "<:009:1118599822375665716>",
	zombie: "<:009:1118599822375665716>",
	a: "<:aaa:1118599793707581541>",
	b: "<:bbb:1118599794848448684>",
	c: "<:ccc:1118599800573657238>",
	d: "<:ddd:1118599802062647327>",
	e: "<:eee:1118599809457209465>",
	f: "<:fff:1118599810711294064>",
	s: "<:sss:1118599819179597944>",
	attack: "<:010:1118604458356654141>",
	attacker: "<:010:1118604458356654141>",
	debuff: "<:011:1118604460705464412>",
	debuffer: "<:011:1118604460705464412>",
	tank: "<:012:1118604462353829930>",
	defence: "<:012:1118604462353829930>",
	magic: "<:013:1118604463846993981>",
	magician: "<:013:1118604463846993981>",
	support: "<:014:1118604466371956736>",
	supporter: "<:014:1118604466371956736>"
};

export function embedUnit(unit: Unit, almanac = false): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];

	const embed = new EmbedBuilder();
	embeds.push(embed);

	embed.setTitle(`**${unit.display_name}**`);
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
	if (unit.items.length) {
		content += `\n**Equipment**: ${unit.items.join(", ")}`;
	}
	if (unit.notes.includes(UNRELEASED_SUPER)) {
		content += `\n*unit is new/unreleased*`;
	}
	embed.setDescription(content.trim());

	if (isDevMode()) {
		embed.setFooter({ text:"*dev mode*" });
	}

	if (!almanac) {
		if (unit.farmQuests?.length) {
			const farmEmbed = new EmbedBuilder();
			farmEmbed.setTitle("**Recruited From**");
			farmEmbed.setDescription(unit.farmQuests.join("\n"));
			embeds.push(farmEmbed);
		}
		if (unit.battleRoads?.length) {
			const battleRoadEmbed = new EmbedBuilder();
			battleRoadEmbed.setTitle("**Battle Roads**");
			battleRoadEmbed.setDescription(unit.battleRoads.join("\n"));
			embeds.push(battleRoadEmbed);
		}
	}
	return embeds;
}

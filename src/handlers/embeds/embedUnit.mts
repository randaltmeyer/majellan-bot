import { EmbedBuilder } from "discord.js";
import { DropInfo, UnitInfo } from "../../types.mjs";
import { round } from "../../utils/round.mjs";
import { findKeyOrValue } from "../../data/findKeyOrValue.mjs";
import { getAllItems } from "../../data/getAllItems.mjs";

function formatDropInfo(dropInfo: DropInfo): string {
	const stageKey = dropInfo.stageSplit[1];
	const stageName = findKeyOrValue(stageKey) ?? "";
	if (!stageName) return "";
	const shortName = stageName?.replace("Chapter ", "Ch").replace("Episode ", "Ep");
	const avgStam = round(dropInfo.stamrate, 2);
	const dropPercent = dropInfo.rate / 100;
	const best = dropInfo.best ? " :tada:" : "";
	return `${shortName} (${dropPercent}%; Avg Stam ${avgStam}) ${best}`;
}

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
	attacker: "<:010:1118604458356654141>",
	debuffer: "<:011:1118604460705464412>",
	tank: "<:012:1118604462353829930>",
	magician: "<:013:1118604463846993981>",
	supporter: "<:014:1118604466371956736>"
};

export async function embedUnit(unit: UnitInfo): Promise<EmbedBuilder[]> {
	const embeds: EmbedBuilder[] = [];

	const embed = new EmbedBuilder();
	embeds.push(embed);
	
	embed.setTitle(`**${unit.cleanName}**`);
	
	embed.setThumbnail(`https://dqt.kusoge.xyz/img/icon/${unit.icon}`);

	const rarity = unit.rarity.name.split(".").pop()?.toLowerCase() as keyof typeof EMOJI;
	const family = unit.family.name.split(".").pop()?.toLowerCase() as keyof typeof EMOJI;
	const role = unit.role.name.split(".").pop()?.toLowerCase() as keyof typeof EMOJI;

	const items = getAllItems().filter(item => item.units.includes(unit.code));
	
	// if (!EMOJI[rarity]) console.log(unit.rarity.name, EMOJI[rarity]);
	// if (!EMOJI[family]) console.log(unit.family.name, EMOJI[family]);
	// if (!EMOJI[role]) console.log(unit.role.name, EMOJI[role]);

	let content = `${EMOJI[rarity]} ${EMOJI[family]} ${EMOJI[role]}`;
	if (unit.talent) content += " " + EMOJI.talentBlossom;
	if (unit.sp) content += " " + EMOJI.characterBuilder;
	content += `\n**Weight:** ${unit.weight}`;
	if (items.length) {
		content += `\n**Equipment**: ${items.map(item => item.cleanName).join(", ")}`;
	}
	embed.setDescription(content.trim());
	if (unit.drops.length) {
		embed.addFields({ name:"**Recruited From**", value:unit.drops.map(formatDropInfo).filter(s=>s).join("\n") });
	}
	if (unit.battleRoads?.length) {
		embed.addFields({ name:"**Battle Roads**", value:unit.battleRoads.map(br => br.name).join("\n") });
	}
	return embeds;
}

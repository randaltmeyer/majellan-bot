import { EmbedBuilder } from "discord.js";
import { DropInfo, UnitInfo } from "../types.mjs";
import { round } from "../utils/round.mjs";
import { findKeyOrValue } from "../data/findKeyOrValue.mjs";

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

export async function embedUnit(unit: UnitInfo): Promise<EmbedBuilder[]> {
	const embeds: EmbedBuilder[] = [];

	const embed = new EmbedBuilder();
	embed.setTitle(unit.cleanName);
	embed.setThumbnail(`https://dqt.kusoge.xyz/img/icon/${unit.icon}`);
	embeds.push(embed);

	let content = ``;
	const rarity = unit.rarity.name.split(".").pop();
	const family = unit.family.name.split(".").pop();
	content += `\n**${rarity} Class ${family}**`;
	content += `\n**Role:** ${unit.role.name.split(".").pop()}`;
	content += `\n**Weight:** ${unit.weight}`;
	content += `\n**Talent Blossoming:** ${unit.talent ? "Yes" : "No"}`;
	embed.setDescription(content);
	if (unit.drops.length) {
		embed.addFields({ name:"**Recruited From**", value:unit.drops.map(formatDropInfo).filter(s=>s).join("\n") });
	}
	if (unit.battleRoads?.length) {
		embed.addFields({ name:"**Battle Roads**", value:unit.battleRoads.map(br => br.name).join("\n") });
	}
	return embeds;
}

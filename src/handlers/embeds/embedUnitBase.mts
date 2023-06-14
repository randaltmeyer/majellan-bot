import { EmbedBuilder } from "discord.js";
import { InfoBase } from "../../types.mjs";
import { findKeyOrValue } from "../../data/findKeyOrValue.mjs";

export async function embedUnitBase(base: InfoBase, baseType: string): Promise<EmbedBuilder> {
	const embed = new EmbedBuilder();
	const name = findKeyOrValue(base.name) ?? base.name.split(".").pop() ?? `Unknown ${baseType}`;
	embed.setTitle(baseType === "Unit" ? name : `${baseType}: ${name}`);
	embed.setThumbnail(`https://dqt.kusoge.xyz/img/icon/${base.icon}`);
	return embed;
}

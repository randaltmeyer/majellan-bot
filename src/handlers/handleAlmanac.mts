import { ButtonInteraction, EmbedBuilder, Interaction, Message, StringSelectMenuInteraction, userMention } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { getAllUnits } from "../data/getAllUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";
import { formUnit } from "./forms/formUnit.mjs";

export async function handleAlmanac(messageOrInteraction: Message | Interaction): Promise<void> {
	if ("customId" in messageOrInteraction) {
		return handleAlmanacInteraction(messageOrInteraction as ButtonInteraction);
	}
	if ("mentions" in messageOrInteraction) {
		return handleAlmanacMessage(messageOrInteraction);
	}
}

// `dqt|almanac|${userId}|add|${unitCode}|nav|${nextCode}`
function getValue(parts: string[], key: string): string | undefined {
	const index = parts.indexOf(key);
	return index < 0 ? undefined : parts[index + 1];
}

function parseCustomId(customId: string) {
	const idParts = customId.split("|");
	const userId = getValue(idParts, "almanac")!;
	const addCode = +getValue(idParts, "add")!;
	const removeCode = +getValue(idParts, "remove")!;
	const navCode = +getValue(idParts, "nav")!;
	return { userId, addCode, removeCode, navCode };
}

async function handleAlmanacInteraction(interaction: ButtonInteraction | StringSelectMenuInteraction): Promise<void> {
	const { userId, addCode, removeCode, navCode } = parseCustomId(interaction.customId);
	const almanac = AlliesAlmanac.getOrCreate(userId);
	if (addCode) {
		almanac.hasUnit(addCode, true);
	}
	if (removeCode) {
		almanac.hasUnit(removeCode, false);
	}
	if (navCode) {
		almanac.activeUnit(navCode);
	}
	const payload = await createPayload(userId);
	await interaction.message.edit(payload);
}

async function handleAlmanacMessage(message: Message): Promise<void> {
	const payload = await createPayload(message.author.id);
	await message.channel.send(payload);
}

function round(percent: number): number {
	return Math.round(10 * percent) / 10;
}

async function createPayload(userId: string) {
	const almanac = AlliesAlmanac.getOrCreate(userId);
	const units = getAllUnits();
	const unitCode = almanac.activeUnit() ?? units[0].code;
	const unit = units.find(unit => unit.code === unitCode) ?? units[0];
	const unitIndex = units.indexOf(unit);
	const unitEntry = almanac.getUnit(unitCode);

	// const unownedFarmableUnits = units.filter(unit => unit.farmQuests.length && !almanac.hasUnit(unit.code));

	const content = `**Allies Almanac:** ${userMention(userId)}`;
	const components = formUnit(userId, unitEntry);
	const embeds = embedUnit(unit, true);

	embeds.push(new EmbedBuilder().setDescription(`
		**Unit:** ${unitIndex + 1} of ${units.length}
		**Owned:** ${unitEntry.has ? "Yes" : "No"}
	`));

	embeds.push(new EmbedBuilder().setDescription(`
		**Total Owned:** ${almanac.count} of ${units.length} (${round(100 * almanac.count / units.length)}%)
		`));
		// **Unowned Farmable Units:** (${unownedFarmableUnits.length}); ${unownedFarmableUnits.map(unit => unit.name).join(", ")}

	return {
		content,
		embeds,
		components
	};
}

import { ButtonInteraction, Interaction, Snowflake } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { findUnits } from "../data/units/findUnits.mjs";
import { canRespond } from "../utils/canRespond.mjs";
import { handleAlmanac } from "./handleAlmanac.mjs";
import { prepByNameMessageArgs, prepClosestMessageArgs } from "./prepMessageArgs.mjs";

async function handleBattleRoads(interaction: ButtonInteraction, userId: Snowflake): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(userId);
	almanac.toggleShowBattleRoads();
	const unitName = interaction.message?.embeds[0].title?.slice(2, -2);
	if (unitName) {
		const response = findUnits(unitName);
		const args = interaction.message.content.includes("closest")
			? prepClosestMessageArgs(almanac, response)
			: prepByNameMessageArgs(almanac, response);
		await interaction.message.edit(args);
	}
	// interaction.deleteReply();
}

async function handleFarmQuests(interaction: ButtonInteraction, userId: Snowflake): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(userId);
	almanac.toggleShowFarmQuests();
	const unitName = interaction.message?.embeds[0].title?.slice(2, -2);
	if (unitName) {
		const response = findUnits(unitName);
		const args = interaction.message.content.includes("closest")
			? prepClosestMessageArgs(almanac, response)
			: prepByNameMessageArgs(almanac, response);
		await interaction.message.edit(args);
	}
	// interaction.deleteReply();
}

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	if (!canRespond(interaction)) {
		return;
	}
	if (!("customId" in interaction)) {
		return;
	}

	const regex = /dqt\|(almanac|battleroads|farmquests)\|(\d+)/;
	const [_, what, userId] = regex.exec(interaction.customId) ?? [];
	if (!userId) {
		return;
	}

	if (interaction.user.id !== userId) {
		await interaction.reply({ content:`Please don't touch another person's buttons!`, ephemeral:true });
		return;
	}

	await interaction.deferUpdate();
	if (what === "almanac") {
		await handleAlmanac(interaction);
	}else if (what === "battleroads") {
		handleBattleRoads(interaction as ButtonInteraction, userId);
	}else if (what === "farmquests") {
		handleFarmQuests(interaction as ButtonInteraction, userId);
	}
}

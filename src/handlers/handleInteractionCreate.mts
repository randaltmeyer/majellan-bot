import { ButtonInteraction, Interaction, Snowflake } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { findUnits } from "../data/units/findUnits.mjs";
import { canRespond } from "../utils/canRespond.mjs";
import { handleAlmanac } from "./handleAlmanac.mjs";
import { prepByNameMessageArgs, prepClosestMessageArgs } from "./prepMessageArgs.mjs";
import { findEquipment } from "../data/equipment/findEquipment.mjs";
import { FindResponse } from "../data/FindResponse.mjs";

async function handleBattleRoads(interaction: ButtonInteraction, userId: Snowflake): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(userId);
	almanac.toggleShowBattleRoads();
	const unitName = interaction.message?.embeds[0]?.title?.split("**")[1];
	if (unitName) {
		const response = findUnits(unitName);
		const args = interaction.message.content.includes("closest")
			? prepClosestMessageArgs(almanac, response)
			: prepByNameMessageArgs(almanac, response);
		await interaction.message.edit(args);
	}
	// interaction.deleteReply();
}

function getResponse(name: string): FindResponse<any> {
	const equipmentResponse = findEquipment(name);
	if (equipmentResponse.byName) {
		return equipmentResponse;
	}
	return findUnits(name);
}

async function handleFarmQuests(interaction: ButtonInteraction, userId: Snowflake): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(userId);
	almanac.toggleShowFarmQuests();
	const name = interaction.message?.embeds[0]?.title?.split("**")[1];
	if (name) {
		const response = getResponse(name);
		const args = interaction.message.content.includes("closest")
			? prepClosestMessageArgs(almanac, response as FindResponse<"Unit">)
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

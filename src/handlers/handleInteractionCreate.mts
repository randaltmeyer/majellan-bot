import { Interaction } from "discord.js";
import { canRespond } from "../utils/canRespond.mjs";
import { handleAlmanac } from "./handleAlmanac.mjs";



export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	if (!canRespond(interaction)) {
		return;
	}
	if ("customId" in interaction) {
		await interaction.deferUpdate();
		await handleAlmanac(interaction);
	}
}
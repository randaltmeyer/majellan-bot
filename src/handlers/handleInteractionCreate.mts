import { Interaction } from "discord.js";
import { canRespond } from "../utils/canRespond.mjs";

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	if (!canRespond(interaction)) {
		return;
	}
	console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}
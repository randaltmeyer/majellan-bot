import { Interaction } from "discord.js";

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}
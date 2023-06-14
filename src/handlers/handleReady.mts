import { ActivityType, Client } from "discord.js";
import { isDevMode } from "../utils/isDevMode.mjs";

export async function handleReady(client: Client): Promise<void> {
	client.user?.setPresence({
		status: "online"
	});

	client.user?.setActivity("Mindini get lost ...", {
		type: ActivityType.Watching
	});

	console.log(isDevMode() ? "Dev Mode Ready" : "Bot Ready");
}
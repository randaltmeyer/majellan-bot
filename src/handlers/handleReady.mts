import { ActivityType, Client } from "discord.js";

export async function handleReady(client: Client): Promise<void> {
	client.user?.setPresence({
		status: "online"
	});
	client.user?.setActivity("Mindini get lost ...", {
		type: ActivityType.Watching
	});
	console.log("ready");
}
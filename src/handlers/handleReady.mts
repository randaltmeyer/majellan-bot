import { ActivityType, Client } from "discord.js";
import { isDevMode } from "../utils/isDevMode.mjs";
import { info, warn } from "../utils/logger.mjs";

export async function handleReady(client: Client): Promise<void> {
	if (client.isReady()) {
		client.user?.setPresence({
			status: "online"
		});
	
		client.user?.setActivity("Mindini get lost ...", {
			type: ActivityType.Watching
		});
	
		info(isDevMode() ? "Dev Mode Ready" : "Bot Ready");
	}else {
		warn("Bot Not Ready");
	}
}
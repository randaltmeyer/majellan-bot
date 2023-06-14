import { Client, IntentsBitField } from "discord.js";
import { readJson } from "./data/readJson.mjs";
import { handleInteractionCreate } from "./handlers/handleInteractionCreate.mjs";
import { handleMessageCreate } from "./handlers/handleMessageCreate.mjs";
import { handleReady } from "./handlers/handleReady.mjs";

const intents = [
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent
];

const clientOptions = { intents };
const client = new Client(clientOptions);
client.once("ready", handleReady);
client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreate);
client.login(readJson("bots", "dev")?.token ?? "");

// node app.mjs
// pm2 start app.mjs --name dqt-sage

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

const botName = process.env["botName"] as "dev" | "prod";
const token = readJson("bots", botName)?.token;
if (token) {
	console.log(`Loading bot: ${botName}`);
	client.login(token).catch(console.error);
}else {
	console.error(`Invalid Token for: ${botName}`);
}

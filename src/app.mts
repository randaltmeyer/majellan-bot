import { Client, IntentsBitField } from "discord.js";
// import { handleInteractionCreate } from "./handlers/handleInteractionCreate.mjs";
import { handleMessageCreate } from "./handlers/handleMessageCreate.mjs";
import { handleReady } from "./handlers/handleReady.mjs";
import { getBotId } from "./utils/getBotId.mjs";
import { getDataPath } from "./data/json/getDataPath.mjs";
import { readJson } from "./data/json/readJson.mjs";
import { BotInfo } from "./types.mjs";

const intents = [
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.MessageContent
];

const clientOptions = { intents };
const client = new Client(clientOptions);
client.once("ready", handleReady);
// client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreate);

const id = getBotId();
const filePath = getDataPath(`bots/${id}.json`);
const { name, token } = readJson<BotInfo>({ filePath }) ?? { };

if (token) {
	console.log(`Loading bot: ${name ?? id}`);
	client.login(token).catch(console.error);
}else {
	console.error(`Invalid Token for: ${name ?? id}`);
}

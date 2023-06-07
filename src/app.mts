import { ActivityType, Client, EmbedBuilder, IntentsBitField, Interaction, Message, userMention } from "discord.js";
import { findByKey, findByValue, findUnit, getBotToken } from "./utils/DataUtils.mjs";
import { UnitInfo, InfoBase } from "./types.mjs";

async function handleReady(client: Client): Promise<void> {
	client.user?.setPresence({
		status: "online"
	});
	client.user?.setActivity("check back later ...", {
		type: ActivityType.Playing
	});
	console.log("ready");
}

async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}

async function handleMessageCreate(message: Message): Promise<void> {
	if (!message.mentions.has("1115758468486397952")) return;
	const terms = message.cleanContent.replace("@DQT Sage", "").trim().split(" ").filter(s => s);
	try {
		const unitKey = await findUnitKey(...terms);
		const unit = unitKey ? findUnit(unitKey, true) : null;
		if (unit) {
			const content = `Hello ${userMention(message.author.id)}, I found the following unit for you:`;
			const embeds = await embedUnit(unit);
			message.channel.send({ content, embeds });
		}else {
			message.reply("Sorry, I couldn't find a unit for you using the terms:\n> " + terms);
		}
	}catch(ex) {
		console.error(ex);
		console.debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		console.debug(terms);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while I was searching!`);
	}

}

async function findUnitKey(...terms: string[]): Promise<string | null> {
	for (const term of terms) {
		const key = findByValue(term);
		if (key) return key;
	}
	return null;
}

async function embedUnitBase(base: InfoBase, baseType: string): Promise<EmbedBuilder> {
	const embed = new EmbedBuilder();
	const name = findByKey(base.name) ?? base.name.split(".").pop() ?? `Unknown ${baseType}`;
	embed.setTitle(baseType === "Unit" ? name : `${baseType}: ${name}`);
	embed.setThumbnail(`https://dqt.kusoge.xyz/img/icon/${base.icon}`);
	return embed;
}
async function embedUnit(unit: UnitInfo): Promise<EmbedBuilder[]> {
	const embeds: EmbedBuilder[] = [];

	const embed = await embedUnitBase(unit, "Unit");
	embeds.push(embed);

	// const rarityEmbed = await embedUnitBase(unit.rarity, "Rarity");
	// embeds.push(rarityEmbed);

	// const familyEmbed = await embedUnitBase(unit.family, "Family");
	// embeds.push(familyEmbed);

	// const roleEmbed = await embedUnitBase(unit.role, "Role");
	// embeds.push(roleEmbed);

	let content = ``;
	content += `\n**Rarity:** ${unit.rarity.name.split(".").pop()}`;
	content += `\n**Family:** ${unit.family.name.split(".").pop()}`;
	content += `\n**Role:** ${unit.role.name.split(".").pop()}`;
	content += `\n**Weight:** ${unit.weight}`;
	embed.setDescription(content);
	if (unit.drops.length) {
		embed.addFields({ name:"**Recruited From:**", value:unit.drops.map(drop => findByKey(drop.stageSplit[1])).join("\n") });
	}

	return embeds;
}

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
client.login(getBotToken());

// node --experimental-modules --es-module-specifier-resolution=node app.mjs
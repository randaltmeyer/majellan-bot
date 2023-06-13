import { ActivityType, Client, EmbedBuilder, IntentsBitField, Interaction, Message, userMention } from "discord.js";
import { DROP_SUPER, BATTLE_ROAD_SUPER, UNRELEASED_SUPER, findAllByValue, findByKey, findByValue, findUnit, getBotToken, normalize } from "./utils/DataUtils.mjs";
import { UnitInfo, InfoBase, DropInfo } from "./types.mjs";
import { round } from "./utils/MathUtils.mjs";

async function handleReady(client: Client): Promise<void> {
	client.user?.setPresence({
		status: "online"
	});
	client.user?.setActivity("Mindini get lost ...", {
		type: ActivityType.Watching
	});
	console.log("ready");
}

async function handleInteractionCreate(interaction: Interaction): Promise<void> {
	console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}

async function handleMessageCreate(message: Message): Promise<void> {
	if (!message.mentions.has("1115758468486397952")) return;
	const terms = message.cleanContent.replace("@DQT Sage", "").trim().split(" ").filter(s => s).map(normalize) as string[];
	try {
		const unitKey = await findUnitKey(...terms);
		const unit = unitKey ? findUnit(unitKey) : null;
		if (unit) {
			const content = `Hello ${userMention(message.author.id)}, I found the following unit for you:`;
			const embeds = await embedUnit(unit);
			message.channel.send({ content, embeds });
		}else {
			const sorry = `Sorry, I couldn't find a unit for you using:\n> ${terms.join(" ")}`;
			const unitKeys = await findUnitKeys(...terms);
			const units = unitKeys.map(unitKey => findUnit(unitKey)).filter(unit => unit) as UnitInfo[];
			const names = units.map(unit => unit.notedName);
			const but = names.length ? `\n\nBut, I did find the following partial matches:\n> ${names.join(", ")}` : "";
			const unreleased = but.includes(UNRELEASED_SUPER),
				hasDrops = but.includes(DROP_SUPER),
				hasBattleRoads = but.includes(BATTLE_ROAD_SUPER);
			let notes = "";
			if (unreleased || hasDrops || hasBattleRoads) {
				notes += "\n";
				if (unreleased) notes += `\n*${UNRELEASED_SUPER} denotes new or unreleased*`;
				if (hasDrops) notes += `\n*${DROP_SUPER} denotes recruitable*`;
				if (hasBattleRoads) notes += `\n*${BATTLE_ROAD_SUPER} denotes battle roads*`;
			}
			message.reply(sorry + but + notes);
		}
	}catch(ex) {
		console.error(ex);
		console.debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		console.debug(name);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while I was searching!`);
	}

}

async function findUnitKey(...terms: string[]): Promise<string | null> {
	let key = findByValue(terms.join(" "));
	if (key) return key;
	for (const term of terms) {
		key = findByValue(term);
		if (key) return key;
	}
	return null;
}

async function findUnitKeys(...terms: string[]): Promise<string[]> {
	const keys: string[] = [];
	for (const term of terms) {
		keys.push(...findAllByValue(term, undefined));
	}
	return keys;
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
	const rarity = unit.rarity.name.split(".").pop();
	const family = unit.family.name.split(".").pop();
	content += `\n**${rarity} Class ${family}**`;
	content += `\n**Role:** ${unit.role.name.split(".").pop()}`;
	content += `\n**Weight:** ${unit.weight}`;
	embed.setDescription(content);
	if (unit.drops.length) {
		embed.addFields({ name:"**Recruited From**", value:unit.drops.map(formatDropInfo).filter(s=>s).join("\n") });
	}
	if (unit.battleRoads?.length) {
		embed.addFields({ name:"**Battle Roads**", value:unit.battleRoads.map(br => br.name).join("\n") });
	}
	return embeds;
}

function formatDropInfo(dropInfo: DropInfo): string {
	const stageKey = dropInfo.stageSplit[1];
	const stageName = findByKey(stageKey) ?? "";
	if (!stageName) return "";
	const shortName = stageName?.replace("Chapter ", "Ch").replace("Episode ", "Ep");
	const avgStam = round(dropInfo.stamrate, 2);
	const dropPercent = dropInfo.rate / 100;
	const best = dropInfo.best ? " :tada:" : "";
	return `${shortName} (${dropPercent}%; Avg Stam ${avgStam}) ${best}`;
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
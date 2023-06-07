import { ActivityType, Client, EmbedBuilder, IntentsBitField, userMention } from "discord.js";
import { readFileSync } from "fs";
function readJson(type, file) {
    const contents = readFileSync(`../data/${type}s/${file}.json`, "utf8");
    try {
        return JSON.parse(contents);
    }
    catch (ex) {
        console.error(ex);
    }
    return null;
}
const keyValueMap = new Map();
function findKeyOrValue(key, value) {
    if (!keyValueMap.size) {
        const profile = readJson("profile", "en");
        if (profile) {
            Object.keys(profile).forEach(key => keyValueMap.set(key, profile[key]));
        }
        const stage = readJson("stage", "en");
        if (stage) {
            Object.keys(stage).forEach(key => keyValueMap.set(key, stage[key]));
        }
    }
    if (key) {
        return keyValueMap.get(key) ?? null;
    }
    if (value) {
        const entries = keyValueMap.entries();
        const regex = new RegExp(`^${value}$`, "i");
        for (const entry of entries) {
            if (regex.test(entry[1])) {
                return entry[0];
            }
        }
    }
    return null;
}
function findByKey(key) { return findKeyOrValue(key, ""); }
function findByValue(value) { return findKeyOrValue("", value); }
async function handleReady(client) {
    client.user?.setPresence({
        status: "online"
    });
    client.user?.setActivity("check back later ...", {
        type: ActivityType.Playing
    });
    console.log("ready");
}
async function handleInteractionCreate(interaction) {
    console.log(`interactionCreate: User(${interaction.user.tag}), Guild(${interaction.guild?.name})`);
}
async function handleMessageCreate(message) {
    if (!message.mentions.has("1115758468486397952"))
        return;
    const terms = message.cleanContent.replace("@DQT Sage", "").split(" ");
    try {
        const unitKey = await findUnitKey(...terms);
        const unit = unitKey ? await findUnit(unitKey) : null;
        if (unit) {
            const content = `Hello ${userMention(message.author.id)}, I found the following unit for you:`;
            const embeds = await embedUnit(unit);
            message.channel.send({ content, embeds });
        }
        else {
            message.reply("Sorry, I couldn't find a unit for you using the terms:\n> " + terms);
        }
    }
    catch (ex) {
        console.error(ex);
        console.debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
        console.debug(terms);
        message.reply(`Hello ${userMention(message.author.id)}, something went wrong while I was searching!`);
    }
}
async function findUnitKey(...terms) {
    for (const term of terms) {
        const key = findByValue(term);
        if (key)
            return key;
    }
    return null;
}
async function findUnit(key) {
    const all = readJson("unit", "all") ?? [];
    for (const unit of all) {
        if (unit.name === key) {
            unit.drops = await findDropsByUnit(key);
            return unit;
        }
    }
    return null;
}
async function findDropsByUnit(unitKey) {
    const all = readJson("unit", "drops") ?? [];
    const drops = [];
    for (const drop of all) {
        if (drop.unitSplit.includes(unitKey)) {
            drops.push(drop);
        }
    }
    return drops;
}
async function embedUnitBase(base, baseType) {
    const embed = new EmbedBuilder();
    const name = findByKey(base.name) ?? base.name.split(".").pop() ?? `Unknown ${baseType}`;
    embed.setTitle(baseType === "Unit" ? name : `${baseType}: ${name}`);
    embed.setThumbnail(`https://dqt.kusoge.xyz/img/icon/${base.icon}`);
    return embed;
}
async function embedUnit(unit) {
    const embeds = [];
    const embed = await embedUnitBase(unit, "Unit");
    embeds.push(embed);
    let content = ``;
    content += `\n**Rarity:** ${unit.rarity.name.split(".").pop()}`;
    content += `\n**Family:** ${unit.family.name.split(".").pop()}`;
    content += `\n**Role:** ${unit.role.name.split(".").pop()}`;
    content += `\n**Weight:** ${unit.weight}`;
    embed.setDescription(content);
    if (unit.drops.length) {
        embed.addFields({ name: "**Recruited From:**", value: unit.drops.map(drop => findByKey(drop.stageSplit[1])).join("\n") });
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
const token = readJson("bot", "dev")?.token;
client.once("ready", handleReady);
client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreate);
client.login(token);
//# sourceMappingURL=app.mjs.map
import { Channel, CrosspostedChannel, Message } from "discord.js";
import { Optional } from "../types.mjs";

function getChannelName(channel: Channel | CrosspostedChannel): string | null {
	if ("name" in channel) return channel.name;
	return null;
}

export function cleanContent(message: Message): string {
	let content = message.cleanContent;
	scrub("@", "here", "everyone");
	scrub("@", message.mentions.repliedUser?.username);
	message.mentions.roles.forEach(role => scrub("@", role.name));
	message.mentions.users.forEach(user => scrub("@", user.username));
	message.mentions.parsedUsers.forEach(user => scrub("@", user.username));
	message.mentions.members?.forEach(member => scrub("@", member.nickname, member.displayName));
	message.mentions.users.forEach(user => scrub("@", user.username));
	message.mentions.channels.forEach(channel => scrub("#", getChannelName(channel)));
	message.mentions.crosspostedChannels.forEach(channel => scrub("#", getChannelName(channel)));
	content = content.replace(/:\w+:/g, "");
	return content.replace(/\s+/g, " ").trim();

	function scrub(prefix: "@" | "#", ...names: (Optional<string>)[]) {
		names.filter(s => s).forEach(name => content = content.replace(`${prefix}${name}`, ""));
	}
}
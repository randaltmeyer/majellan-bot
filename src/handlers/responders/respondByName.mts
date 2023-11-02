import { Message } from "discord.js";
import { AlliesAlmanac } from "../../data/AlliesAlmanac.mjs";
import { FindResponse } from "../../data/FindResponse.mjs";
import { prepByNameMessageArgs } from "../prepMessageArgs.mjs";

export async function respondByName(message: Message, findResponse: FindResponse<any>): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(message.author.id);
	const args = prepByNameMessageArgs(almanac, findResponse);
	await message.reply(args);
}
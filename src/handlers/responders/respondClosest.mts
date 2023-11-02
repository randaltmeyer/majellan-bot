import { Message } from "discord.js";
import { AlliesAlmanac } from "../../data/AlliesAlmanac.mjs";
import { FindResponse } from "../../data/FindResponse.mjs";
import { prepClosestMessageArgs } from "../prepMessageArgs.mjs";

export async function respondClosest(message: Message, findResponse: FindResponse<any>): Promise<void> {
	const almanac = AlliesAlmanac.getOrCreate(message.author.id);
	const args = prepClosestMessageArgs(almanac, findResponse);
	await message.reply(args);
}
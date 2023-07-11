import { Message } from "discord.js";
import { cleanContent } from "../utils/cleanContent.mjs";
import { handleAlmanac } from "./handleAlmanac.mjs";
import { handleSearch } from "./handleSearch.mjs";

export async function handleMessageCreate(message: Message): Promise<void> {
	const content = cleanContent(message);
	if (content === "almanac") {
		return handleAlmanac(message);
	}
	return handleSearch(message);
}

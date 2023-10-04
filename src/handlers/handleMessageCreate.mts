import { Message } from "discord.js";
import { cleanContent } from "../utils/cleanContent.mjs";
import { handleAlmanac } from "./handleAlmanac.mjs";
import { handleSearch } from "./handleSearch.mjs";
import { canRespond } from "../utils/canRespond.mjs";
import { handleUpdate } from "./handleUpdate.mjs";

export async function handleMessageCreate(message: Message): Promise<void> {
	if (!canRespond(message)) {
		return;
	}
	const content = cleanContent(message);
	if (content === "almanac") {
		return handleAlmanac(message);
	}
	if (content === "update" || content === "force update") {
		return handleUpdate(message, content === "force update");
	}
	return handleSearch(message);
}

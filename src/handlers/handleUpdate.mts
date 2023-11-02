import { Message } from "discord.js";
import { getDataPath } from "../data/json/getDataPath.mjs";
import { readJson } from "../data/json/readJson.mjs";
import { writeJson } from "../data/json/writeJson.mjs";
import { updateData } from "../data/updateData.mjs";
import { UpdateInfo } from "../types.mjs";
import { error } from "../utils/logger.mjs";

let updating = false;

function tsToRelative(ts: number): string {
	const unixTs = Math.floor(ts / 1000);
	return `<t:${unixTs}:R>`;
}

export async function handleUpdate(message: Message, force: boolean): Promise<void> {
	if (updating) {
		message.reply(`*currently updating*`);
	}

	const filePath = getDataPath(`updateInfo.json`);
	const updateInfo = readJson<UpdateInfo>({ filePath });
	if (updateInfo && !force) {
		const aDayAgo = Date.now() - 1000 * 60 * 60 * 24;
		if (updateInfo.ts > aDayAgo) {
			message.reply(`*last updated* ${tsToRelative(updateInfo.ts)}`);
			return;
		}
	}

	const replyPromise = message.reply(`*update started* ${tsToRelative(Date.now())}`);

	updating = true;

	await updateData().catch(error);

	const updateTs = Date.now();

	writeJson({ ts:updateTs, userId:message.author.id }, { filePath });

	updating = false;

	const reply = await replyPromise;
	await reply.edit(`${reply.content}\n:arrow_down:\n*update complete* ${tsToRelative(updateTs)}`);
}

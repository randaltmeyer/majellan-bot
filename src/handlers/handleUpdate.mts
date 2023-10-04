import { fork } from "child_process";
import { Message } from "discord.js";
import { clearCache } from "../data/clearCache.mjs";
import { readJson } from "../data/readJson.mjs";
import { writeJson } from "../data/writeJson.mjs";

let updating = false;

function tsToRelative(ts: number): string {
	const unixTs = Math.floor(ts / 1000);
	return `<t:${unixTs}:R>`;
}

export async function handleUpdate(message: Message, force: boolean): Promise<void> {
	if (updating) {
		message.reply(`*currently updating*`);
	}

	const updateInfo = readJson("", "updateInfo");
	if (updateInfo && !force) {
		const aDayAgo = Date.now() - 1000 * 60 * 60 * 24;
		if (updateInfo.ts > aDayAgo) {
			message.reply(`*last updated* ${tsToRelative(updateInfo.ts)}`);
			return;
		}
	}

	const replyPromise = message.reply(`*update started* ${tsToRelative(Date.now())}`);

	updating = true;

	await runUpdate().catch(console.error);
	clearCache();

	const updateTs = Date.now();

	writeJson("", "updateInfo", { ts:updateTs, userId:message.author.id });

	updating = false;

	const reply = await replyPromise;
	await reply.edit(`${reply.content}\n:arrow_down:\n*update complete* ${tsToRelative(updateTs)}`);
}

function runUpdate(): Promise<void> {
	return new Promise((resolve, reject) => {
		const updateProcess = fork("crawl.mjs", ["--update"], { cwd:"./dist" });
		updateProcess.on("error", reject);
		updateProcess.on("exit", exitCode => exitCode === 0 ? resolve() : reject({exitCode}));
	});
}

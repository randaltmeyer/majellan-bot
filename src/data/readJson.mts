import { Snowflake } from "discord.js";
import { existsSync, readFileSync } from "fs";
import { BotInfo, UpdateInfo } from "../types.mjs";
import { AlliesAlmanacCore } from "./AlliesAlmanac.mjs";
import { getDataPath } from "./getDataPath.mjs";

export function readJson(type: "almanacs", file: string): AlliesAlmanacCore | null;
export function readJson(type: "bots", file: Snowflake): BotInfo | null;
export function readJson(type: "", file: "updateInfo"): UpdateInfo | null;
export function readJson<T>(type: string, file: string): T | null {
	try {
		const path = getDataPath(`${type}/${file}.json`);
		if (existsSync(path)) {
			const contents = readFileSync(path, "utf8");
			return JSON.parse(contents);
		}
		console.error(`Invalid Path: ${path}`);
	}catch(ex) {
		console.error(ex);
	}
	return null;
}

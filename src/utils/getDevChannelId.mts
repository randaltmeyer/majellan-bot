import { Snowflake } from "discord.js";

let _devChannelId: Snowflake | undefined;
export function getDevChannelId() {
	if (_devChannelId === undefined) {
		_devChannelId = process.env["devChannelId"]!;
	}
	return _devChannelId;
}
import { Snowflake } from "discord.js";

let _botId: Snowflake | undefined;
export function getBotId() {
	if (_botId === undefined) {
		_botId = process.env["botId"]!;
	}
	return _botId;
}
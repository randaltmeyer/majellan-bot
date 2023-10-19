import { Snowflake } from "discord.js";

let _liveChannelId: Snowflake | undefined;
export function getLiveChannelId() {
	if (_liveChannelId === undefined) {
		_liveChannelId = process.env["liveChannelId"]!;
	}
	return _liveChannelId;
}
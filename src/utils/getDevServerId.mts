import { Snowflake } from "discord.js";

let _devServerId: Snowflake | undefined;
export function getDevServerId() {
	if (_devServerId === undefined) {
		_devServerId = process.env["devServerId"]!;
	}
	return _devServerId;
}
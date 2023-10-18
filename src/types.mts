import { Snowflake } from "discord.js";

export type BotInfo = {
	id: Snowflake,
	name?: string;
	token: string;
};

export type UpdateInfo = {
	ts: number;
	userId: Snowflake;
};

export type Nullable<T> = T | null;
export type Optional<T> = T | null | undefined;

export const UNRELEASED_SUPER = "⁰";
export const DROP_SUPER = "¹";
export const BATTLE_ROAD_SUPER = "²";

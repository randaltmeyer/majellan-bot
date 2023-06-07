
export type BotInfo = {
	token: string;
}

export type DropInfo = {
	stageSplit: string[];
	unitSplit: string[];
}

export type Fetch = {
	label: string;
	jsonUrl: string;
	jsUrl: string;
	file: string;
	key: string;

	listMethod: "GET" | "POST" | "JS";
	listKey: string;
	nameKey: string;
	descKey: string;
}

export type Lang = "en" | "ja" | "ko" | "zh_TW";
export const LANGS: Lang[] = ["en", "ja", "ko", "zh_TW"];

export type StringStringMap = { [key: string]: string; };

export type UnitInfoBase = {
	code: number;
	name: string;
	icon: string;
}

export type UnitInfo = UnitInfoBase & {
	family: UnitInfoBase;
	role: UnitInfoBase;
	rarity: UnitInfoBase;
	weight: number;
	drops: DropInfo[];
}

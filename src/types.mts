
export type BotInfo = {
	token: string;
}

export type DropInfo = {
	stageSplit: string[];
	unitSplit: string[];
}

export type Fetch = {
	label: string;
	listMethod: "GET" | "POST" | "JS";
	listKey: string;
	nameKey: string;
	descKey: string;
}

export type InfoBase = {
	code: number;
	name: string;
	icon: string;
}

export type Lang = "en" | "ja" | "ko" | "zh_TW";
export const LANGS: Lang[] = ["en", "ja", "ko", "zh_TW"];

export type StringStringMap = { [key: string]: string; };

export type UnitInfo = InfoBase & {
	family: InfoBase;
	role: InfoBase;
	rarity: InfoBase;
	weight: number;
	drops: DropInfo[];
}

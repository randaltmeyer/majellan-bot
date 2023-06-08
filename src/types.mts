
export type BotInfo = {
	token: string;
}

/*
{
	"code":100020102,
	"base":110001,
	"unit":"110001~MonsterProfile.DisplayName.Slime.Slime~MonsterIcon_0000_00_Slime.png~MonsterRankIcon_F.png~EquipmentIcon_SlimeFamilly.png",
	"stage":"1000201~Stage.DisplayName.Story.Normal.02.01~300",
	"portal":"2~1001~AreaGroup.DisplayName.Story.Season1",
	"portalId":null,
	"rate":1500,
	"stamina":3,
	"best":false,
	"stamrate":20,
	"date":"null",
	"stageSplit":["1000201","Stage.DisplayName.Story.Normal.02.01","300"],
	"unitSplit":["110001","MonsterProfile.DisplayName.Slime.Slime","MonsterIcon_0000_00_Slime.png","MonsterRankIcon_F.png","EquipmentIcon_SlimeFamilly.png"],
	"portalSplit":["2","1001","AreaGroup.DisplayName.Story.Season1"]
}
*/

export type DropInfo = {
	code: number;
	base: number;
	unit: string;
	stage: string;
	portal: string;
	/** 100x percentage? --> rate / 100 = % */
	rate: number;
	/** stamina for stage? */
	stamina: number;
	best: boolean;
	/** average stamina to drop? */
	stamrate: number;
	date:string;
	/** [?, ?, eventPortalKey?] */
	portalSplit: string[];
	/** [stageCode, stageKey, stageCp] */
	stageSplit: string[];
	/** [unitCode, unitKey, unitIcon, rankIcon, familyIcon] */
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

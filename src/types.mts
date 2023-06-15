
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
};

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

export type UnitPassiveInfo = InfoBase & {
	passive: InfoBase & {
		boost: InfoBase & {
			skill: InfoBase; // <-- skill.name is the skill key we want to look for
		}
	};
};

export type UnitInfo = InfoBase & {
	/** The unique identifier originally stored in the name field when fetched. */
	key: string;
	/** Name with no notes. */
	cleanName: string;
	/** Name with notes about unreleased or recruitable or battle road */
	notedName: string;

	family: InfoBase;
	role: InfoBase;
	rarity: InfoBase;
	weight: number;
	/** talent blossoming */
	talent?: 1;
	/** character builder */
	sp?: 1;

	passives: UnitPassiveInfo[];

	drops: DropInfo[];
	battleRoads: InfoBase[];
}

export type ItemInfo = InfoBase & {
	/** The unique identifier originally stored in the name field when fetched. */
	key: string;
	/** Name with no notes. */
	cleanName: string;
	notedName: string;

	/** unique identifier originally stored in the description field when fetched. */
	descKey: string;
	description: string;

	max: number;
	skill: any | null;
	rankItem: any | null;
	rankEquip: InfoBase & {
		/** image filename */
		background: string;
		/** image filename */
		frame: string;
		/** image filename */
		material: string;
	};
	type: number;
	subtype: number;
	/** nameKey + "\n" + descKey */
	zzz: string;

	/** unit.code */
	units: number[];
}

export type Nullable<T> = T | null;
export type Optional<T> = T | null | undefined;

export const UNRELEASED_SUPER = "⁰";
export const DROP_SUPER = "¹";
export const BATTLE_ROAD_SUPER = "²";

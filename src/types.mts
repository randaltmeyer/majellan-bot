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
export const ITEM_SUPER = "";

export const EMOJI = {
	// characterBuilder: "<:998:1118620463527104532>",
	characterBuilder: "<:999:1118621771852157008>",
	// characterBuilder: "<:997:1118676568408084491>",
	talentBlossom: "<:000:1118597460101697556>",
	beast: "<:001:1118599798149365811>",
	demon: "<:002:1118599804843462747>",
	devil: "<:002:1118599804843462747>",
	dragon: "<:003:1118599806416322592>",
	hero: "<:004:1118599813219483708>",
	inorganic: "<:005:1118599814452629584>",
	material: "<:005:1118599814452629584>",
	"???": "<:006:1118599815878692964>",
	mystery: "<:006:1118599815878692964>",
	unknown: "<:006:1118599815878692964>",
	nature: "<:007:1118600211229581345>",
	slime: "<:008:1118600213649686638>",
	undead: "<:009:1118599822375665716>",
	zombie: "<:009:1118599822375665716>",
	a: "<:aaa:1118599793707581541>",
	b: "<:bbb:1118599794848448684>",
	c: "<:ccc:1118599800573657238>",
	d: "<:ddd:1118599802062647327>",
	e: "<:eee:1118599809457209465>",
	f: "<:fff:1118599810711294064>",
	s: "<:sss:1118599819179597944>",
	attack: "<:010:1118604458356654141>",
	attacker: "<:010:1118604458356654141>",
	debuff: "<:011:1118604460705464412>",
	debuffer: "<:011:1118604460705464412>",
	tank: "<:012:1118604462353829930>",
	defence: "<:012:1118604462353829930>",
	magic: "<:013:1118604463846993981>",
	magician: "<:013:1118604463846993981>",
	support: "<:014:1118604466371956736>",
	supporter: "<:014:1118604466371956736>"
};

export type Area = {
	id: string;
	area_display_name: string;
	area_sub_display_name: string;

	area_group: string;
	area_group_name: string;

	/** cat 4 is battle road */
	area_category: number;

	/** units usable in battle road */
	area_available_monsters: {
		monster_name: string;
		/** unit id */
		monster_path: string;
		monster_icon: string;
		is_required: 1 | 0;
	}[];
};

export type Farmable = {
	stage_area_name: string;
	stage_area_group_name: string;
	stage_display_name: string;
	enemy_display_name: string;
	scout_probability: number;
	stamina_per_drop: number;
	is_best_drop_rate: boolean;
};

export type Equipment = {
	id: string;
	equipment_display_name: string;
	equipment_category: string;
};

export type Unit = {
	id: string;
	name: string;
	icon: string;

	family: string;
	role: string;
	rank: string;
	weight: string;

	hasBlossom: boolean;
	hasCharacterBuilder: boolean;

	/** custom */
	notes: string;
	/** custom */
	farmQuests: string[];
	/** custom */
	battleRoads: string[];
	/** custom */
	equipment: string[];
	/** custom */
	skillNames: string[];
};
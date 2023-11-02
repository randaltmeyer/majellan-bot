import { Equipment, Stage, Unit } from "../types.mjs";

export type FindResponse<Type extends "Unit" | "Equipment" | "Stage", What = Type extends "Unit" ? Unit : Type extends "Stage" ? Stage : Equipment> = {
	type: Type;
	content: string;
	cleanContent: string;
	byName?: What;
	also: What[];
	byPartialName: What[];
	closest?: What;
	relatedUnit?: string;
};
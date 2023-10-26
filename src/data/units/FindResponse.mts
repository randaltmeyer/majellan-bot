import { Equipment, Unit } from "../../types.mjs";

export type FindResponse<Type extends "Unit" | "Equipment", What = Type extends "Unit" ? Unit : Equipment> = {
	type: Type;
	content: string;
	cleanContent: string;
	byName?: What;
	also: What[];
	byPartialName: What[];
	closest?: What;
	relatedUnit?: string;
};
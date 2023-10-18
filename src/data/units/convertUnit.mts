import { Unit } from "../../types.mjs";
import { RawUnit } from "./RawUnit.mjs";

function parseSkillNames(raw: RawUnit): string[] {
	return raw.active_skills?.map(skill => skill.skill_name) ?? [];
}

export function convertUnit(raw: RawUnit): Unit {
	const {
		id,
		display_name,
		unit_icon,
		family,
		role,
		unit_rank,
		weight,
		has_blossom,
		has_character_builder
	} = raw;
	return {
		id,
		name: display_name,
		icon: unit_icon,
		family,
		role,
		rank: unit_rank,
		weight,
		hasBlossom: has_blossom,
		hasCharacterBuilder: has_character_builder,
		notes: "",
		farmQuests: [],
		battleRoads: [],
		equipment: [],
		skillNames: parseSkillNames(raw)
	};
}
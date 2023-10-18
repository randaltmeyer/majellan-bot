import { RawEquipment } from "./RawEquipment.mjs";

function testEquipment(unitSkillNames: string[], equipment: RawEquipment): boolean {
	const regex = new RegExp(`^(${unitSkillNames.join("|")})\\b`);
	const { slot_1, slot_2, slot_3 } = equipment?.equipment_alchemy_slots ?? {};
	return !!slot_1?.find(alc => regex.test(alc.passive_skill.skill_name))
		|| !!slot_2?.find(alc => regex.test(alc.passive_skill.skill_name))
		|| !!slot_3?.find(alc => regex.test(alc.passive_skill.skill_name));
}

export function hasEquipment(unitSkillNames: string[], equipment: RawEquipment[]): boolean {
	return !!equipment.find(eq => testEquipment(unitSkillNames, eq));
}

export function findAndFormatEquipment(unitSkillNames: string[], equipment: RawEquipment[]): string[] {
	return equipment.filter(eq => testEquipment(unitSkillNames, eq))
		.map(eq => eq.equipment_display_name);
}
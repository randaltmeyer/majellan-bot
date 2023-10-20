import { RawEquipment } from "./RawEquipment.mjs";

function testEquipment(unitSkillNames: string[], equipment: RawEquipment): boolean {
	const potencyRegex = new RegExp(`^(${unitSkillNames.join("|")})\\s+(Potency|Recovery|Brilliant)\\s+\\+`, "i");
	const { slot_1, slot_2, slot_3 } = equipment?.equipment_alchemy_slots ?? {};
	return !![slot_1, slot_2, slot_3].find(slot => slot?.find(alc => potencyRegex.test(String(alc?.passive_skill?.skill_name))));
}

export function hasEquipment(unitSkillNames: string[], equipment: RawEquipment[]): boolean {
	return !!equipment.find(eq => testEquipment(unitSkillNames, eq));
}

export function findAndFormatEquipment(unitSkillNames: string[], equipment: RawEquipment[]): string[] {
	return equipment.filter(eq => testEquipment(unitSkillNames, eq))
		.map(eq => eq.equipment_display_name);
}
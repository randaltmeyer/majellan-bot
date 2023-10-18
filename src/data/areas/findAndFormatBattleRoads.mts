import { Area } from "./Area.mjs";

export function findAndFormatBattleRoads(areas: Area[], unitName: string): string[] {
	const battleRoads = areas.filter(area => area.area_category === 4 && area.area_available_monsters.find(areaUnit => areaUnit.monster_name === unitName));
	battleRoads.sort();
	return battleRoads.map(area => {
		const parts: string[] = [];
		parts.push(area.area_group_name);
		parts.push(area.area_display_name);
		parts.push(area.area_sub_display_name);
		return parts.filter(s => s).join(" - ");
	});
}
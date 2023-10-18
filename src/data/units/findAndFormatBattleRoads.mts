import { Area } from "../../types.mjs";

function match(unitName:string, area: Area): boolean {
	return area.area_category === 4
		&& area.area_available_monsters.find(areaUnit => areaUnit.monster_name === unitName) !== undefined;
}

export function hasBattleRoads(unitName: string, areas: Area[]): boolean {
	return !!areas.find(area => match(unitName, area));
}

export function findAndFormatBattleRoads(unitName: string, areas: Area[]): string[] {
	const battleRoads = areas.filter(area => match(unitName, area));
	battleRoads.sort((a, b) => a < b ? -1 : 1);
	return battleRoads.map(area => {
		const parts: string[] = [];
		parts.push(area.area_group_name);
		parts.push(area.area_display_name);
		parts.push(area.area_sub_display_name);
		return parts.filter(s => s).join(" - ");
	});
}
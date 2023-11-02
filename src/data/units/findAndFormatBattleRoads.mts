import { Area } from "../../types.mjs";
import { formatStageName } from "../stages/formatStageName.mjs";

function match(unitName:string, area: Area): boolean {
	return area.area_category === 4
		&& area.area_available_monsters.find(areaUnit => areaUnit.monster_name === unitName) !== undefined;
}

export function hasBattleRoads(unitName: string, areas: Area[]): boolean {
	return !!areas.find(area => match(unitName, area));
}

export function findAndFormatBattleRoads(unitName: string, areas: Area[]): string[] {
	const battleRoads = areas
		.filter(area => match(unitName, area))
		.map(({ area_group_name, area_display_name, area_sub_display_name }) =>
			formatStageName([area_group_name, area_display_name, area_sub_display_name])
		);
	battleRoads.sort((a, b) => sortIgnoreCase(a, a.toLowerCase(), b, b.toLowerCase()));
	return battleRoads;
}

function sortIgnoreCase(a: string, aLower: string, b: string, bLower: string): -1 | 0 | 1 {
	if (aLower === bLower) {
		return a < b ? 1 : -1;
	}
	return aLower < bLower ? -1 : 1;
}
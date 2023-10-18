import { Farmable } from "./Farmable.mjs";

export function findAndFormatFarmables(farmables: Farmable[], unitName: string): string[] {
	const unitFarmables = farmables.filter(farmable => farmable.enemy_display_name === unitName);

	unitFarmables.sort((a, b) => {
		if (a.is_best_drop_rate !== b.is_best_drop_rate) {
			return a.is_best_drop_rate ? -1 : 1;
		}
		if (a.stamina_per_drop !== b.stamina_per_drop) {
			return a.stamina_per_drop < b.stamina_per_drop ? -1 : 1;
		}
		if (a.stamina_per_drop !== b.stamina_per_drop) {
			return a.stamina_per_drop < b.stamina_per_drop ? -1 : 1;
		}
		if (a.scout_probability !== b.scout_probability) {
			return a.scout_probability < b.scout_probability ? 1 : -1;
		}
		return a.stage_display_name.toLowerCase() < b.stage_display_name.toLowerCase() ? -1 : 1;
	});

	return unitFarmables.map(({ stage_display_name, scout_probability, stamina_per_drop, is_best_drop_rate }) => {
		const shortName = stage_display_name.replace("Chapter ", "Ch").replace("Episode ", "Ep");
		return `${shortName} (${scout_probability}%; Avg Stam ${stamina_per_drop}) ${is_best_drop_rate ? ":tada:" : ""}`.trim();
	});
	// return battleRoads.map(area => {
	// 	const parts: string[] = [];
	// 	parts.push(area.area_group_name);
	// 	parts.push(area.area_display_name);
	// 	parts.push(area.area_sub_display_name);
	// 	return parts.filter(s => s).join(" - ");
	// });
}
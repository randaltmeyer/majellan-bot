import { Farmable } from "../../types.mjs";
import { round } from "../../utils/round.mjs";
import { formatStageName } from "./formatStageName.mjs";

function match(unitName: string, farmable: Farmable): boolean {
	return farmable.enemy_display_name === unitName;
}

export function hasFarmables(unitName: string, farmables: Farmable[]): boolean {
	return farmables.find(farmable => match(unitName, farmable)) !== undefined;
}

export function findAndFormatFarmables(unitName: string, farmables: Farmable[]): string[] {
	const unitFarmables = farmables.filter(farmable => match(unitName, farmable));

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

	return unitFarmables.map(({ stage_area_name, stage_area_group_name, stage_display_name, scout_probability, stamina_per_drop, is_best_drop_rate }) => {
		const name = formatStageName([ stage_area_name, stage_area_group_name, stage_display_name ]);
		const tada = is_best_drop_rate ? " :tada:" : "";
		const stats = `Drop Rate: ${round(scout_probability, 1)}%; Avg Stam Per Drop: ${round(stamina_per_drop, 1)}`.trim();
		return `${name}${tada}\n- ${stats}`;
	});
}

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

	unitFarmables.forEach((a, index, array) => {
		const b = array[index + 1];
		const c = array[index + 2];
		if (b && c) {
			const aName = formatStageName([ a.stage_area_group_name, a.stage_area_name, a.stage_display_name ]);
			const bName = formatStageName([ b.stage_area_group_name, b.stage_area_name, b.stage_display_name ]);
			const cName = formatStageName([ c.stage_area_group_name, c.stage_area_name, c.stage_display_name ]);
			if (aName === bName && bName === cName) {
				const sorted = [a, b, c].sort((_a, _b) => {
					if (_a.stage_stamina_cost === _b.stage_stamina_cost) {
						return 0;
					}
					return _a.stage_stamina_cost < _b.stage_stamina_cost ? -1 : 1;
				});
				sorted[0].stage_area_name = sorted[0].stage_area_name + ": Normal";
				sorted[1].stage_area_name = sorted[1].stage_area_name + ": Hard";
				sorted[2].stage_area_name = sorted[2].stage_area_name + ": Very Hard";
			}
		}
	});

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
		const [name, difficulty] = formatStageName([ stage_area_group_name, stage_area_name, stage_display_name ], true);
		const tada = is_best_drop_rate ? ":tada:" : "";
		const diff = difficulty ? `(${difficulty})` : ``;
		const stats = `${diff} Drop Rate: ${round(scout_probability, 1)}%; Avg Stam Per Drop: ${round(stamina_per_drop, 1)} ${tada}`.trim();
		return [name, `- ${stats}`];
	}).flat().reduce((out, line) => {
		if (line.startsWith("-")) {
			out.push(line);
		}else {
			const last = out.filter(s => !s.startsWith("-")).pop();
			if (!last || last !== line) {
				out.push(line);
			}
		}
		return out;
	}, [] as string[]);
}

import { Farmable } from "../../types.mjs";
import { getAll } from "../json/getAll.mjs";

function match(unitName: string, farmable: Farmable): boolean {
	return farmable.enemy_display_name === unitName;
}

export function hasFarmables(unitName: string, farmables: Farmable[]): boolean {
	return farmables.find(farmable => match(unitName, farmable)) !== undefined;
}

export function findAndFormatFarmables(unitName: string, farmables = getAll("farmable")): string[] {
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
		const name = formatName({ stage_area_name, stage_area_group_name, stage_display_name } as Farmable);
		const tada = is_best_drop_rate ? " :tada:" : "";
		const stats = `Drop Rate: ${scout_probability}%; Avg Stam Per Drop: ${stamina_per_drop}`.trim();
		return `${name}${tada}\n- ${stats}`;
	});
}

function formatName({ stage_area_name, stage_area_group_name, stage_display_name }: Farmable): string {
	const nameParts = [
		stage_area_group_name,
		stage_area_name,
		stage_display_name
	]
		.filter(s => s)
		.map(part => part.replace("Chapter ", "Ch. ").replace("Episode ", "Ep. ").trim());
	if (nameParts[1]?.includes(nameParts[0])) {
		nameParts.shift();
	}
	while (nameParts.length > 1 && nameParts[nameParts.length - 1].includes(nameParts[nameParts.length - 2])) {
		nameParts.splice(nameParts.length - 2, 1);
	}
	return nameParts.join(" - ").trim();
}
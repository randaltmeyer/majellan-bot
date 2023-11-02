import { Farmable, Stage, StageDrop } from "../../types.mjs";
// import { debug } from "../../utils/logger.mjs";
import { round } from "../../utils/round.mjs";
import { formatStageName } from "../stages/formatStageName.mjs";

function matchFarmable(unitName: string, farmable: Farmable): boolean {
	return farmable.enemy_display_name === unitName;
}
function findStageDrop(unitName: string, stage: Stage) {
	if (unitName !== "Slime") {
		const crystalName = `${unitName} Crystal`;
		const drop = stage.drops.find(drop => drop.name === crystalName);
		if (drop) {
			// debug(`${unitName} + ${crystalName} > ${stage.stage_area_group_name} ${stage.stage_area_name} ${stage.stage_display_name}`);
			return drop;
		}
	}
	return undefined;
}
/*
		"drops": [
			{ "name": "Gold", "dropPercent": 100, "quantity": 26 },
			{ "name": "Experience", "dropPercent": 100, "quantity": 752 },
			{ "name": "True DQ V Estark Key", "dropPercent": 10, "quantity": 1 },
			{ "name": "True DQ V Banner", "dropPercent": 25, "quantity": 34 },
			{ "name": "True DQ V Banner", "dropPercent": 25, "quantity": 37 },
			{ "name": "True DQ V Banner", "dropPercent": 25, "quantity": 41 },
			{ "name": "True DQ V Banner", "dropPercent": 25, "quantity": 48 },
			{ "name": "Pankraz Gotha Crystal", "dropPercent": 10, "quantity": 1 },
			{ "name": "Gems", "dropPercent": 100, "quantity": 50 },
			{ "name": "True DQ V Banner", "dropPercent": 100, "quantity": 40 }
		]
*/

export function hasFarmables(unitName: string, farmables: Farmable[]): boolean {
	return farmables.find(farmable => matchFarmable(unitName, farmable)) !== undefined;
}
export function hasStages(unitName: string, stages: Stage[]): boolean {
	return stages.find(stage => findStageDrop(unitName, stage)) !== undefined;
}

type Generic = {
	group: string;
	area: string;
	name: string;
	stamina: number;
	dropPercent: number;
	staminaPerDrop: number;
	isBest: boolean;
};

function convertFarmable(farmable: Farmable): Generic {
	return {
		group: farmable.stage_area_group_name,
		area: farmable.stage_area_name,
		name: farmable.stage_display_name,
		stamina: farmable.stage_stamina_cost,
		dropPercent: farmable.scout_probability,
		staminaPerDrop: farmable.stamina_per_drop,
		isBest: farmable.is_best_drop_rate
	};
}

function convertStage({ stage, drop }: { stage:Stage; drop:StageDrop }): Generic {
	return {
		group: stage.stage_area_group_name,
		area: stage.stage_area_name,
		name: stage.stage_display_name,
		stamina: stage.stage_stamina_cost,
		dropPercent: drop.dropPercent,
		staminaPerDrop: stage.stage_stamina_cost / drop.dropPercent,
		isBest: false
	};
}

export function findAndFormatFarmables(unitName: string, farmables: Farmable[], stages: Stage[]): string[] {
	const unitFarmables = farmables.filter(farmable => matchFarmable(unitName, farmable));
	const unitStages = stages.map(stage => ({ stage, drop:findStageDrop(unitName, stage)! })).filter(pair => pair.drop);
	const generics = unitFarmables.map(convertFarmable).concat(unitStages.map(convertStage));
	const bestStaminaPerDrop = generics.reduce((best, { staminaPerDrop }) => Math.min(best, staminaPerDrop), 9999);
	generics.forEach(generic => generic.isBest = generic.staminaPerDrop === bestStaminaPerDrop);

	generics.forEach((a, index, array) => {
		const b = array[index + 1];
		const c = array[index + 2];
		if (b && c) {
			const aName = formatStageName([ a.group, a.area, a.name ]);
			const bName = formatStageName([ b.group, b.area, b.name ]);
			const cName = formatStageName([ c.group, c.area, c.name ]);
			if (aName === bName && bName === cName) {
				const sorted = [a, b, c].sort((_a, _b) => {
					if (_a.stamina === _b.stamina) {
						return 0;
					}
					return _a.stamina < _b.stamina ? -1 : 1;
				});
				sorted[0].area = sorted[0].area + ": Normal";
				sorted[1].area = sorted[1].area + ": Hard";
				sorted[2].area = sorted[2].area + ": Very Hard";
			}
		}
	});

	generics.sort((a, b) => {
		if (a.isBest !== b.isBest) {
			return a.isBest ? -1 : 1;
		}
		if (a.staminaPerDrop !== b.staminaPerDrop) {
			return a.staminaPerDrop < b.staminaPerDrop ? -1 : 1;
		}
		if (a.dropPercent !== b.dropPercent) {
			return a.dropPercent < b.dropPercent ? 1 : -1;
		}
		return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
	});

	return generics.map(({ group, area, name, dropPercent, staminaPerDrop, isBest }) => {
		const [formattedName, difficulty] = formatStageName([ group, area, name ], true);
		const tada = isBest ? ":tada:" : "";
		const diff = difficulty ? `(${difficulty})` : ``;
		const stats = `${diff} Drop Rate: ${round(dropPercent, 1)}%; Avg Stam Per Drop: ${round(staminaPerDrop, 1)} ${tada}`.trim();
		return [formattedName, `- ${stats}`];
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

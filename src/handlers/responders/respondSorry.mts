import { Message } from "discord.js";
import { FindResponse } from "../../data/FindResponse.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, UNRELEASED_SUPER } from "../../types.mjs";
import { isDevMode } from "../../utils/isDevMode.mjs";

export async function respondSorry(message: Message, unitResponse: FindResponse<"Unit">, equipmentResponse: FindResponse<"Equipment">, stageResponse: FindResponse<"Stage">): Promise<void> {
	const sorry = `Sorry, I couldn't find a unit, equipment, nor stages using:\n> ${unitResponse.content}`;
	let but = "";
	let notes = "";

	const unitByP = unitResponse.byPartialName.length;
	if (unitByP) {
		const names = unitResponse.byPartialName.map(unit => unit.name + unit.notes);
		but = `\n\nI did find partial unit match(es):\n> ${names.join(", ")}`;

		const unreleased = but.includes(UNRELEASED_SUPER),
			hasDrops = but.includes(DROP_SUPER),
			hasBattleRoads = but.includes(BATTLE_ROAD_SUPER);
		if (unreleased || hasDrops || hasBattleRoads) {
			notes += "\n";
			if (unreleased) {
				notes += `\n*${UNRELEASED_SUPER} new/unreleased*`;
			}
			if (hasDrops) {
				notes += `\n*${DROP_SUPER} farmable*`;
			}
			if (hasBattleRoads) {
				notes += `\n*${BATTLE_ROAD_SUPER} battle roads*`;
			}
		}
	}

	const equipmentByP = equipmentResponse.byPartialName.length;
	if (equipmentByP) {
		const names = equipmentResponse.byPartialName.map(eq => eq.equipment_display_name);
		but += `\n\nI did find partial equipment match(es):\n> ${names.join(", ")}`;
	}

	const stageByP = stageResponse.byPartialName.length;
	if (stageByP) {
		const names = stageResponse.byPartialName.map(stage => stage.stage_display_name);
		but += `\n\nI did find partial stage match(es):\n> ${names.join(", ")}`;
	}

	let footer = `\n\n[Majellan Bot Home](https://discord.gg/nYwdFTND4E)`;
	if (isDevMode()) {
		footer += `\ndev mode`;
	}

	await message.reply(sorry + but + notes + footer);
}
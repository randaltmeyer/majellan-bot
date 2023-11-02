import { Message, userMention } from "discord.js";
import { getAll } from "../data/json/getAll.mjs";
import { findEquipment } from "../data/equipment/findEquipment.mjs";
import { findStage } from "../data/stages/findStage.mjs";
import { findUnits } from "../data/units/findUnits.mjs";
import { cleanContent } from "../utils/cleanContent.mjs";
import { debug, error } from "../utils/logger.mjs";
import { respondByName } from "./responders/respondByName.mjs";
import { respondClosest } from "./responders/respondClosest.mjs";
import { respondFarmQuests } from "./responders/respondFarmQuests.mjs";
import { respondSorry } from "./responders/respondSorry.mjs";

export async function handleSearch(message: Message): Promise<void> {
	const content = cleanContent(message);
	if (content.length < 3) {
		const content = `Hello, I can only search for names of 3 or more characters.`;
		await message.reply(content);
		return;
	}
	if (content === "farm") {
		return respondFarmQuests(message);
	}
	try {
		const unitResponse = findUnits(content);
		const equipmentResponse = findEquipment(content);
		const stageResponse = findStage(content);
		if (unitResponse.byName) {
			await respondByName(message, unitResponse);

		}else if (equipmentResponse.byName) {
			const eqName = equipmentResponse.byName.equipment_display_name;
			const relatedUnit = getAll("unit").find(unit => unit.equipment.includes(eqName))?.name;
			await respondByName(message, { ...equipmentResponse, relatedUnit });

		}else if (stageResponse.byName) {
			await respondByName(message, stageResponse);

		}else if (unitResponse.closest && !equipmentResponse.byPartialName.length && !stageResponse.byPartialName.length) {
			await respondClosest(message, unitResponse);

		}else if (equipmentResponse.closest && !unitResponse.byPartialName.length && !stageResponse.byPartialName.length) {
			await respondClosest(message, equipmentResponse);

		}else if (stageResponse.closest && !unitResponse.byPartialName.length && !equipmentResponse.byPartialName.length) {
			await respondClosest(message, stageResponse);

		}else {
			await respondSorry(message, unitResponse, equipmentResponse, stageResponse);
		}
	}catch(ex) {
		error(ex);
		debug(`messageCreate: User(${message.member?.user.tag}), Guild(${message.guild?.name})`);
		message.reply(`Hello ${userMention(message.author.id)}, something went wrong while searching!`);
	}
}
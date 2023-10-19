import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { FindUnitsResponse } from "../data/units/findUnits.mjs";
import { embedPartialUnits } from "./embeds/embedPartialUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";

type MessageArgs = { content:string; embeds:EmbedBuilder[]; components:ActionRowBuilder<any>[] };

function createBattleRoadsButton(userId: Snowflake, showBattleRoads: boolean, disabled: boolean): ButtonBuilder {
	const hideShow = showBattleRoads ? "Hide" : "Show";
	return new ButtonBuilder()
		.setCustomId(`dqt|battleroads|${userId}`)
		.setLabel(`${hideShow} Battle Roads`)
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(disabled);
}

function createFarmQuestsButton(userId: Snowflake, showFarmQuests: boolean, disabled: boolean): ButtonBuilder {
	const hideShow = showFarmQuests ? "Hide" : "Show";
	return new ButtonBuilder()
		.setCustomId(`dqt|farmquests|${userId}`)
		.setLabel(`${hideShow} Recruitment Stages`)
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(disabled);
}

export function prepByNameMessageArgs(almanac: AlliesAlmanac, { byName, also }: FindUnitsResponse): MessageArgs {
	const content = `Hello, I found this unit:`;
	const embeds = embedUnit(byName!, { battleRoads:almanac.showBattleRoads, farmQuests:almanac.showFarmQuests });
	if (also.length) {
		embeds.push(...embedPartialUnits(also));
	}

	const battleRoads = createBattleRoadsButton(almanac.userId, almanac.showBattleRoads, !byName?.battleRoads.length);
	const farmQuests = createFarmQuestsButton(almanac.userId, almanac.showFarmQuests, !byName?.farmQuests.length);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(battleRoads, farmQuests);

	return { content, embeds, components:[buttonRow] };
}

export function prepClosestMessageArgs(almanac: AlliesAlmanac, { closest }: FindUnitsResponse): MessageArgs {
	const content = `Hello, this is the closest unit I could find:`;
	const embeds = embedUnit(closest!, { battleRoads:almanac.showBattleRoads, farmQuests:almanac.showFarmQuests });

	const battleRoads = createBattleRoadsButton(almanac.userId, almanac.showBattleRoads, !closest?.battleRoads.length);
	const farmQuests = createFarmQuestsButton(almanac.userId, almanac.showFarmQuests, !closest?.farmQuests.length);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(battleRoads, farmQuests);

	return { content, embeds, components:[buttonRow] };
}
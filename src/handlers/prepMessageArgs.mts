import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from "discord.js";
import { AlliesAlmanac } from "../data/AlliesAlmanac.mjs";
import { FindResponse } from "../data/FindResponse.mjs";
import { embedEquipment } from "./embeds/embedEquipment.mjs";
import { embedPartialUnits } from "./embeds/embedPartialUnits.mjs";
import { embedUnit } from "./embeds/embedUnit.mjs";
import { embedStage } from "./embeds/embedStage.mjs";

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
		.setLabel(`${hideShow} Farm Stages`)
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(disabled);
}

function prepByNameMessageArgsUnit(almanac: AlliesAlmanac, { byName, also }: FindResponse<"Unit">): MessageArgs {
	const content = `Hello, I found this unit:`;

	const embeds = embedUnit(byName!, { battleRoads:almanac.showBattleRoads, farmQuests:almanac.showFarmQuests });
	if (also.length) {
		embeds.push(...embedPartialUnits(also));
	}

	const battleRoads = createBattleRoadsButton(almanac.userId, almanac.showBattleRoads, !byName?.battleRoads.length);
	const farmQuests = createFarmQuestsButton(almanac.userId, almanac.showFarmQuests, !byName?.farmQuests.length);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(battleRoads, farmQuests);

	return { content, embeds, components:[buttonRow] };
}

function prepByNameMessageArgsEquipment(_almanac: AlliesAlmanac, { byName, relatedUnit }: FindResponse<"Equipment">): MessageArgs {
	const content = `Hello, I found this equipment:`;

	const embeds = embedEquipment(byName!, { farmQuests:false, relatedUnit });

	return { content, embeds, components:[] };
}

function prepByNameMessageArgsStage(_almanac: AlliesAlmanac, { byName }: FindResponse<"Stage">): MessageArgs {
	const content = `Hello, I found this stage:`;

	const embeds = embedStage(byName!);

	return { content, embeds, components:[] };
}

export function prepByNameMessageArgs(almanac: AlliesAlmanac, response: FindResponse<"Unit" | "Equipment" | "Stage">): MessageArgs {
	if (response.type === "Unit") {
		return prepByNameMessageArgsUnit(almanac, response as FindResponse<"Unit">);
	}
	if (response.type === "Stage") {
		return prepByNameMessageArgsStage(almanac, response as FindResponse<"Stage">);
	}
	return prepByNameMessageArgsEquipment(almanac, response as FindResponse<"Equipment">);
}

function prepClosestMessageArgsUnit(almanac: AlliesAlmanac, { closest }: FindResponse<"Unit">): MessageArgs {
	const content = `Hello, this is the closest unit I could find:`;
	const embeds = embedUnit(closest!, { battleRoads:almanac.showBattleRoads, farmQuests:almanac.showFarmQuests });

	const battleRoads = createBattleRoadsButton(almanac.userId, almanac.showBattleRoads, !closest?.battleRoads.length);
	const farmQuests = createFarmQuestsButton(almanac.userId, almanac.showFarmQuests, !closest?.farmQuests.length);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(battleRoads, farmQuests);

	return { content, embeds, components:[buttonRow] };
}

function prepClosestMessageArgsEquipment(_almanac: AlliesAlmanac, { closest }: FindResponse<"Equipment">): MessageArgs {
	const content = `Hello, this is the closest equipment I could find:`;
	const embeds = embedEquipment(closest!, { farmQuests:false });

	return { content, embeds, components:[] };
}

export function prepClosestMessageArgs(almanac: AlliesAlmanac, response: FindResponse<any>): MessageArgs {
	if (response.type === "Unit") {
		return prepClosestMessageArgsUnit(almanac, response as FindResponse<"Unit">);
	}
	return prepClosestMessageArgsEquipment(almanac, response as FindResponse<"Equipment">);
}
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { AlmanacUnitEntry } from "../../data/AlliesAlmanac.mjs";
import { getAllUnits } from "../../data/getAllUnits.mjs";

// StringSelectMenuBuilder, StringSelectMenuOptionBuilder

function getPrevUnit(code: number) {
	const allUnits = getAllUnits();
	const index = allUnits.findIndex(unit => unit.code === code);
	if (index === 0) return allUnits[allUnits.length - 1];
	return allUnits[index - 1];
}
function getNextUnit(code: number) {
	const allUnits = getAllUnits();
	const index = allUnits.findIndex(unit => unit.code === code);
	if (index === allUnits.length - 1) return allUnits[0];
	return allUnits[index + 1];
}

function createButton(label: string, id: string, style?: ButtonStyle): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(label)
		.setCustomId(id)
		.setStyle(style ?? ButtonStyle.Primary);
}

function navRow(userId: string, unitEntry: AlmanacUnitEntry): ActionRowBuilder<ButtonBuilder> {
	const row = new ActionRowBuilder<ButtonBuilder>();

	const unitCode = unitEntry.code;
	const prevCode = getPrevUnit(unitCode).code;
	const nextCode = getNextUnit(unitCode).code;

	// previous button
	const prevBtn = createButton("Previous", `dqt|almanac|${userId}|nav|${prevCode}`, ButtonStyle.Secondary);
	row.addComponents(prevBtn);

	if (unitEntry.has) {
		// remove button
		const removeBtn = createButton("Remove", `dqt|almanac|${userId}|remove|${unitCode}`, ButtonStyle.Danger);
		row.addComponents(removeBtn);
	}else {
		// add button
		const addBtn = createButton("Add", `dqt|almanac|${userId}|add|${unitCode}`);
		row.addComponents(addBtn);

		// add / next button
		const addNextBtn = createButton("Add & Next", `dqt|almanac|${userId}|add|${unitCode}|nav|${nextCode}`);
		row.addComponents(addNextBtn);
	}

	// next button
	const nextBtn = createButton("Next", `dqt|almanac|${userId}|nav|${nextCode}`, ButtonStyle.Secondary);
	row.addComponents(nextBtn);

	return row;
}

export function formUnit(userId: string, unitEntry: AlmanacUnitEntry): ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] {
	return [navRow(userId, unitEntry)];
}
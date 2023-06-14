import { getAllUnits } from "./getAllUnits.mjs";
import { UnitInfo } from "../types.mjs";
import LevenshteinComparator from "../utils/Levenshtein.mjs";
import { normalizeString } from "../utils/normalizeString.mjs";

function findUnitByName(cleanContent: string, units = getAllUnits()): UnitInfo | undefined {
	const regex = new RegExp(`^${cleanContent}$`, "i");
	return units.find(unit => regex.test(unit.cleanName));
}

function findUnitsByPartialName(cleanContent: string, units = getAllUnits()): UnitInfo[] {
	const regex = new RegExp(`${cleanContent}`, "i");
	return units.filter(unit => regex.test(unit.cleanName));
}

function findUnitsByLevenshtein(cleanContent: string, units = getAllUnits()): UnitInfo[] {
	const lower = cleanContent.toLowerCase();
	const distances = units.map(unit => LevenshteinComparator.compare(lower, unit.cleanName.toLowerCase()));
	const shortestDistance = distances.reduce((shortest, dist) => dist < shortest ? dist : shortest, lower.length);
	// 1 means missing a letter, 2 means two letters transposed; 3 letter names get whacky ...
	if (shortestDistance === 1 || (shortestDistance === 2 && shortestDistance < lower.length - 1)) {
		return distances.map((d, i) => d === shortestDistance ? units[i] : null).filter(unit => unit) as UnitInfo[];
	}
	return [];
}

export function findUnits(content: string) {
	const cleanContent = normalizeString(content);
	const byPartialName = findUnitsByPartialName(cleanContent);
	const byName = findUnitByName(cleanContent, byPartialName);
	const byLevenshtein = findUnitsByLevenshtein(cleanContent);
	const byPartialLevenshtein = findUnitsByLevenshtein(cleanContent, byPartialName);
	const closest = byName
		?? (byLevenshtein.length === 1 ? byLevenshtein[0] : undefined)
		?? (byPartialLevenshtein.length === 1 ? byPartialLevenshtein[0] : undefined)
		?? (byPartialName.length === 1 ? byPartialName[0] : undefined);
	return { content, cleanContent, byName, byPartialName, byLevenshtein, byPartialLevenshtein, closest };
}

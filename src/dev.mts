import { findUnits } from "./data/findUnits.mjs";

const searchText = process.argv.slice(2).join(" ");
const results = findUnits(searchText);
const json = {
	content:results.content,
	byName:results.byName?.cleanName,
	byPartialName:results.byPartialName.map(u => u.cleanName),
	byLevenshtein:results.byLevenshtein.map(u => u.cleanName),
	byPartialLevenshtein:results.byPartialLevenshtein.map(u => u.cleanName),
	closest:results.closest?.cleanName
};
// console.log(json);
// console.log(results.byName ?? results.closest);
console.log(json.byName)
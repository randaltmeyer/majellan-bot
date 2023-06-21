import { findUnits } from "./data/findUnits.mjs";

const searchText = process.argv.slice(2).join(" ");
const results = findUnits(searchText);
console.log({ unit:results.byName ?? results.closest, also:results.also.map(u=>u.name+u.notes) });
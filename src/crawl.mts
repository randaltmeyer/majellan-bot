import { findDropsByUnit } from "./data/findDropsByUnit.mjs";
import { findKeyOrValue } from "./data/findKeyOrValue.mjs";
import { formatDropInfo } from "./data/formatDropInfo.mjs";
import { getDqtJpHtml, getDqtJpJs, getDqtJpJson } from "./data/getDqtJpData.mjs";
import { readJson } from "./data/readJson.mjs";
import { BATTLE_ROAD_SUPER, DROP_SUPER, InfoBase, Item, LANGS, Lang, UNRELEASED_SUPER, Unit } from "./types.mjs";
import { normalizeString } from "./utils/normalizeString.mjs";
import { writeJson } from "./data/writeJson.mjs";

const skipFetches = process.argv.includes("--skipFetches");
const skipUnits = process.argv.includes("--skipUnits");
const skipItems = process.argv.includes("--skipItems");
const skipReadCache = process.argv.includes("--skipReadCache");
const skipWriteCache = process.argv.includes("--skipWriteCache");


type LangJson = { lang:Lang; json:string; }
async function fetchAndParseJs(key: string): Promise<LangJson[]> {
	const langJson = [];
	if (key) {
		const js = await getDqtJpJs(key);
		if (js) {
			for (const lang of LANGS) {
				const match = js.match(new RegExp(`var ${key}_${lang} = (\{(?:.|\n)*?\});`)) ?? [];
				const json = match[1];
				if (json) {
					langJson.push({ lang, json })
				}
			}
		}
	}
	return langJson;
}

async function doFetches() {
	if (!skipFetches) {
		console.log("Doing fetches ...");
		const fetches = readJson("fetches", "all") ?? [];
		for (const fetch of fetches) {
			if (fetch.listMethod) {
				console.log(`\tStarting: ${fetch.label}`);

				if (fetch.listMethod === "JS") {
					const langJsons = await fetchAndParseJs(fetch.listKey);
					langJsons.forEach(langJson => writeJson(fetch.listKey, langJson.lang, langJson.json));

				}else {
					const listJson = await getDqtJpJson<[]>(fetch.listKey, fetch.listMethod).catch(console.error) ?? [];
					writeJson(fetch.listKey, "raw", listJson);

					const nameLangJsons = await fetchAndParseJs(fetch.nameKey);
					nameLangJsons.forEach(langJson => writeJson(`${fetch.listKey}/name`, langJson.lang, langJson.json));

					const descLangJsons = await fetchAndParseJs(fetch.descKey);
					descLangJsons.forEach(langJson => writeJson(`${fetch.listKey}/desc`, langJson.lang, langJson.json));
				}

				console.log(`\tFinished: ${fetch.label}`);
			}
		}
		console.log("Doing Fetches ... done");
	}
}

async function doItems() {
	if (!skipItems) {
		console.log("Updating Items ...");
		let item: Item;
		const allItems: Item[] = [];
		const allItemsRaw = readJson("items", "raw") ?? [];
		for (const itemRaw of allItemsRaw) {
			if (itemRaw.name.includes("EquipmentProfile") && itemRaw.rankEquip?.name?.match(/\.[AS]$/)) {
				console.log(`\tFetching Item "${itemRaw.name}" ...`);

				allItems.push(item = {
					notes: "",
					rankEquip: itemRaw.rankEquip,
					units: [] as number[]
				} as Item);

				// name
				const nameRaw = normalizeString(findKeyOrValue(itemRaw.name)) ?? itemRaw.name;
				item.name = nameRaw.replace(/\*/g, "");

				item.description = normalizeString(findKeyOrValue(itemRaw.description)) ?? itemRaw.description;

				// notes
				if (nameRaw.includes("*")) item.notes += UNRELEASED_SUPER;

				const itemHtml = await getDqtJpHtml("item", itemRaw.code, skipReadCache, skipWriteCache);
				const passives = itemHtml.match(/"\/passive\/\d+"/g) ?? [];
				for (const passive of passives) {
					const passiveCode = +((passive.match(/\d+/) ?? [])[0] ?? 0);
					if (passiveCode) {
						const passiveHtml = await getDqtJpHtml("passive", passiveCode, skipReadCache, skipWriteCache);
						const skills = passiveHtml.match(/"\/skill\/\d+"/g) ?? [];
						for (const skill of skills) {
							const skillCode = +((skill.match(/\d+/) ?? [])[0] ?? 0);
							const skillHtml = await getDqtJpHtml("skill", skillCode, skipReadCache, skipWriteCache);
							const units = skillHtml.match(/"\/unit\/\d+"/g) ?? [];
							const unitCodes = units.map(unit => unit.match(/\d+/)?.[0]).map(s => +(s??"")).filter(n => n);
							item.units = unitCodes;
						}
					}
				}
			}
		}
		writeJson(`items`, `all`, allItems);
		console.log("Updating Items ... done");
	}
}

async function doUnits() {
	if (!skipUnits) {
		console.log("Updating Units ...");
		let unit: Unit;
		const allUnits: Unit[] = [];
		const allUnitsRaw = readJson("units", "raw") ?? [];
		for (const unitRaw of allUnitsRaw) {
			console.log(`\tFetching Unit "${unitRaw.name}" ...`);

			allUnits.push(unit = {
				code: unitRaw.code,
				notes: "",
				icon: unitRaw.icon,
				family: unitRaw.family,
				role: unitRaw.role,
				rarity: unitRaw.rarity,
				weight: unitRaw.weight,
				tBlossom: !!unitRaw.talent,
				cBuilder: !!unitRaw.sp,
				farmQuests: [] as string[],
				battleRoads: [] as string[]
			} as Unit);

			// name
			const nameRaw = normalizeString(findKeyOrValue(unitRaw.name)) ?? unitRaw.name;
			unit.name = nameRaw.replace(/\*/g, "");

			// notes
			if (nameRaw.includes("*")) unit.notes += UNRELEASED_SUPER;

			// drops
			unit.farmQuests = findDropsByUnit(unitRaw.name).map(formatDropInfo).filter(s => s);
			if (unit.farmQuests.length) unit.notes += DROP_SUPER;

			// battle roads
			const html = await getDqtJpHtml("unit", unitRaw.code, skipReadCache, skipWriteCache);
			const battleRoadSection = html.match(/Battle road\:<\/div>(.|\n)+<div class="ar">/)?.[0];
			if (battleRoadSection) {
				const battleRoadMatches = battleRoadSection.replace(/\s/g, " ").match(/<a\s+class="text"\s+href="\/event\/area\/(\d+)">(.*?)<\/a>/g);
				if (battleRoadMatches?.length) {
					const battleRoads = battleRoadMatches.map(aTag => {
						const match = aTag.match(/<a\s+class="text"\s+href="\/event\/area\/(\d+)">(.*?)<\/a>/);
						return match ? { code:+match[1], name:normalizeString(match[2]), icon:"" } : null;
					}).filter(br => br) as InfoBase[];
					unit.battleRoads = battleRoads.map(br => br.name).filter(s => s);
				}
			}
			if (unit.battleRoads.length) unit.notes += BATTLE_ROAD_SUPER;

			// items
			const items = readJson("items", "all") ?? [];
			unit.items = items.filter(item => item.units.includes(unitRaw.code)).map(item => item.name + item.notes);
		}
		allUnits.sort((a, b) => a.code < b.code ? -1 : 1);
		writeJson("units", "all", allUnits);
		console.log("Updating Units ... done");
	}
}

async function main() {
	console.log("Starting main()");

	await doFetches();

	await doItems();

	await doUnits();

	console.log("Finished main()");
}

main();

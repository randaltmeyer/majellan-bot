import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getAllUnits } from "./data/getAllUnits.mjs";
import { readJson } from "./data/readJson.mjs";
import { InfoBase, LANGS, Lang } from "./types.mjs";
import { getDqtJpHtml, getDqtJpJs, getDqtJpJson } from "./data/getDqtJpData.mjs";
import { getAllItems } from "./data/getAllItems.mjs";
import { normalizeString } from "./utils/normalizeString.mjs";



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

function writeFile(path: string, content: any): void {
	const dir = path.split("/").slice(0, -1).join("/");
	if (!existsSync(dir)) {
		mkdirSync(dir);
	}
	const payload = typeof(content) === "string" ? content : JSON.stringify(content);
	writeFileSync(path, payload);
}

async function main() {
	console.log("Starting main()");
	const skipFetches = process.argv.includes("--skipFetches");
	const skipUnits = process.argv.includes("--skipUnits");
	const skipItems = process.argv.includes("--skipItems");
	const skipReadCache = process.argv.includes("--skipReadCache");
	const skipWriteCache = process.argv.includes("--skipWriteCache");

	if (!skipFetches) {
		console.log("Doing fetches ...");
		const fetches = readJson("fetches", "all") ?? [];
		for (const fetch of fetches) {
			if (fetch.listMethod) {
				console.log(`\tStarting: ${fetch.label}`);

				if (fetch.listMethod === "JS") {
					const langJsons = await fetchAndParseJs(fetch.listKey);
					langJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/${langJson.lang}.json`, langJson.json));

				}else {
					const listJson = await getDqtJpJson<[]>(fetch.listKey, fetch.listMethod).catch(console.error) ?? [];
					writeFile(`../data/${fetch.listKey}/all.json`, listJson);

					const nameLangJsons = await fetchAndParseJs(fetch.nameKey);
					nameLangJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/name/${langJson.lang}.json`, langJson.json));

					const descLangJsons = await fetchAndParseJs(fetch.descKey);
					descLangJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/desc/${langJson.lang}.json`, langJson.json));
				}

				console.log(`\tFinished: ${fetch.label}`);
			}
		}
		console.log("Doing Fetches ... done");
	}

	if (!skipUnits) {
		console.log("Updating Units ...");
		const allUnits = getAllUnits();
		for (const unit of allUnits) {
			console.log(`\tFetching Unit "${unit.cleanName}" ...`);
			const html = await getDqtJpHtml("unit", unit.code, skipReadCache, skipWriteCache);
			const battleRoadSection = html.match(/Battle road\:<\/div>(.|\n)+<div class="ar">/)?.[0];
			if (battleRoadSection) {
				const battleRoadMatches = battleRoadSection.replace(/\s/g, " ").match(/<a\s+class="text"\s+href="\/event\/area\/(\d+)">(.*?)<\/a>/g);
				if (battleRoadMatches?.length) {
					unit.battleRoads = battleRoadMatches.map(aTag => {
						const match = aTag.match(/<a\s+class="text"\s+href="\/event\/area\/(\d+)">(.*?)<\/a>/);
						return match ? { code:+match[1], name:normalizeString(match[2]), icon:"" } : null;
					}).filter(br => br) as InfoBase[];
				}
			}
		}
		writeFile(`../data/units/all.json`, allUnits);
		console.log("Updating Units ... done");
	}

	if (!skipItems) {
		console.log("Updating Items ...");
		const allItems = getAllItems();
		for (const item of allItems) {
			if (item.key.includes("EquipmentProfile") && item.rankEquip?.name?.match(/\.[AS]$/)) {
				console.log(`\tFetching Item "${item.cleanName}" (${item.key}) ...`);
				const itemHtml = await getDqtJpHtml("item", item.code, skipReadCache, skipWriteCache);
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
		writeFile(`../data/items/all.json`, allItems);
		console.log("Updating Items ... done");
	}

	console.log("Finished main()");
}

main();

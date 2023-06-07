import { LANGS, Lang } from "./types.mjs";
import { getFetches } from "./utils/DataUtils.mjs";
import { getJson, getText } from "./utils/HttpsUtils.mjs";
import { writeFileSync, existsSync, mkdirSync } from "fs";

async function fetchJson<T>(key: string, method: "GET" | "POST"): Promise<T | null> {
	const url = getJsonUrl(key, method);
	const payload = method === "POST" ? {} : undefined;
	const json = await getJson(url, payload).catch(console.error);
	if (json?.status) {
		console.warn(`\t\t`+JSON.stringify(json));
		return null;
	}
	return json ?? null;
}

function getJsUrl(key: string): string {
	return `https://dqtjp.kusoge.xyz/json/${key}.js`;
}
function getJsonUrl(key: string, method: "GET" | "POST"): string {
	const suffix = method === "GET" ? "/0" : "";
	return `https://dqtjp.kusoge.xyz/${key}/q${suffix}`;
}

type LangJson = { lang:Lang; json:string; }
async function fetchAndParseJs(key: string): Promise<LangJson[]> {
	const langJson = [];
	if (key) {
		const js = await getText(getJsUrl(key)).catch(console.error);
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

	console.log("Getting fetches ...");
	const fetches = getFetches();
	console.log("Getting fetches ... done");

	for (const fetch of fetches) {
		if (fetch.listMethod) {
			console.log(`Starting: ${fetch.label}`);

			console.log(`\tfetching ...`);

			if (fetch.listMethod === "JS") {
				const langJsons = await fetchAndParseJs(fetch.listKey);
				langJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/${langJson.lang}.json`, langJson.json));

			}else {
				const listJson = await fetchJson(fetch.listKey, fetch.listMethod).catch(console.error);
				writeFile(`../data/${fetch.listKey}/all.json`, listJson);

				const nameLangJsons = await fetchAndParseJs(fetch.nameKey);
				nameLangJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/name/${langJson.lang}.json`, langJson.json));

				const descLangJsons = await fetchAndParseJs(fetch.descKey);
				descLangJsons.forEach(langJson => writeFile(`../data/${fetch.listKey}/desc/${langJson.lang}.json`, langJson.json));
			}

			console.log(`Finished: ${fetch.label}`);
		}
	}

	console.log("Finished main()");
}

main();

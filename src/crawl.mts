import { LANGS } from "./types.mjs";
import { getFetches } from "./utils/DataUtils.mjs";
import { getJson, getText } from "./utils/HttpsUtils.mjs";
import { writeFileSync } from "fs";

async function main() {
	console.log("Starting main()");

	console.log("Getting fetches ...");
	const fetches = getFetches();
	console.log("Getting fetches ... done");

	for (const fetch of fetches) {
		console.log(`Starting: ${fetch.label}`);

		console.log(`\tfetching ...`);
		if (fetch.jsonUrl) {
			const json = await getJson(fetch.jsonUrl).catch(console.error);
			if (json?.status === 405) {
				console.warn(JSON.stringify(json));
			}else if (json) {
				console.log(`\twriting ...`);
				writeFileSync(`..${fetch.file}`, JSON.stringify(json));
			}
		}
		if (fetch.jsUrl) {
			const js = await getText(fetch.jsUrl).catch(console.error);
			if (js) {
				console.log(`\twriting js ...`);
				writeFileSync(`..${fetch.file}`, js);
				console.log(`\tparsing langs ...`);
				for (const lang of LANGS) {
					const match = js.match(new RegExp(`var ${fetch.key}_${lang} = (\{(?:.|\n)*?\});`)) ?? [];
					const json = match[1];
					if (json) {
						console.log(`\twriting ${lang} ...`);
						writeFileSync(`../data/${fetch.label.replace(" ", "")}/${lang}.json`, json);
					}
				}
			}
		}

		console.log(`Finished: ${fetch.label}`);
	}

	console.log("Finished main()");
}

main();

import { getFetches } from "./utils/DataUtils.mjs";
import { getJson } from "./utils/HttpsUtils.mjs";
import { writeFileSync } from "fs";

async function main() {
	console.log("Starting main()");

	console.log("Getting fetches ...");
	const fetches = getFetches();
	console.log("Getting fetches ... done");

	for (const fetch of fetches) {
		console.log(`Starting: ${fetch.label}`);

		console.log(`\tfetching ...`);
		const json = await getJson(fetch.url).catch(console.error);
		if (json) {
			console.log(`\twriting ...`);
			writeFileSync(`..${fetch.file}`, JSON.stringify(json));
		}

		console.log(`Finished: ${fetch.label}`);
	}

	console.log("Finished main()");
}

main();

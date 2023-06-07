import { getJson } from "./utils/HttpsUtils.mjs";
import { writeFileSync } from "fs";

const fetches = [
	{ label:"Units List", url:"https://dqt.kusoge.xyz/units/q", file:"/data/units/all.json" }
];

async function main() {
	console.log("Starting main()");

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

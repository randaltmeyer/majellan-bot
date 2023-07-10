import { writeFileSync } from "fs";
import { AlliesAlmanacCore } from "./AlliesAlmanac.mjs";
import { getDataPath } from "./getDataPath.mjs";

export function writeJson(type: "almanacs", userId:string, almanac: AlliesAlmanacCore): void;

export function writeJson(type: string, name:string, data: any): void {
	const root = getDataPath(type);
	const path = `${root}/${name}.json`;
	const json = JSON.stringify(data);
	writeFileSync(path, json);
}
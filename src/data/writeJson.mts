import { writeFileSync } from "fs";
import { AlliesAlmanacCore } from "./AlliesAlmanac.mjs";
import { getDataPath } from "./getDataPath.mjs";
import { UpdateInfo } from "../types.mjs";

export function writeJson(type: "almanacs", userId:string, almanac: AlliesAlmanacCore): void;
export function writeJson(type: "", name:"updateInfo", updateInfo: UpdateInfo): void;

export function writeJson(type: string, name:string, data: any): void;

export function writeJson(type: string, name:string, data: any): void {
	const root = getDataPath(type);
	const path = `${root}/${name}.json`;
	const payload = typeof(data) === "string" ? data : JSON.stringify(data);
	writeFileSync(path, payload);
}
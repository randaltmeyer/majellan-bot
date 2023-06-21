import { DropInfo } from "../types.mjs";
import { round } from "../utils/round.mjs";
import { findKeyOrValue } from "./findKeyOrValue.mjs";

export function formatDropInfo(dropInfo: DropInfo): string {
	const stageKey = dropInfo.stageSplit[1];
	const stageName = findKeyOrValue(stageKey) ?? "";
	if (!stageName) return "";
	const shortName = stageName?.replace("Chapter ", "Ch").replace("Episode ", "Ep");
	const avgStam = round(dropInfo.stamrate, 2);
	const dropPercent = dropInfo.rate / 100;
	const best = dropInfo.best ? " :tada:" : "";
	return `${shortName} (${dropPercent}%; Avg Stam ${avgStam}) ${best}`;
}
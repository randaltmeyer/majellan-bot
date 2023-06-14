import { DropInfo } from "../types.mjs";
import { readJson } from "./readJson.mjs";

const _allDropInfo: DropInfo[] = [];

function getAllDropInfo(): DropInfo[] {
	if (!_allDropInfo.length) {
		const allDropInfo = readJson("unitdrop", "all") ?? [];
		_allDropInfo.push(...allDropInfo);
	}
	return _allDropInfo;
}

export function findDropsByUnit(unitKey: string): DropInfo[] {
	const drops: DropInfo[] = [];
	const allDropInfo = getAllDropInfo();
	for (const drop of allDropInfo) {
		if (drop.unitSplit.includes(unitKey)) {
			drops.push(drop);
		}
	}
	return drops;
}

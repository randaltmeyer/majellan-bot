import { DropInfo } from "../types.mjs";
import { readJson } from "./readJson.mjs";

const _allDropInfo: DropInfo[] = [];

function getAllDropInfo(): DropInfo[] {
	if (!_allDropInfo.length) {
		const allDropInfo = readJson("unitdrop", "raw") ?? [];
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
	drops.sort((a, b) => {
		if (a.best !== b.best) return a.best ? -1 : 1;
		if (a.stamrate !== b.stamrate) return a.stamrate < b.stamrate ? -1 : 1;
		if (a.stamina !== b.stamina) return a.stamina < b.stamina ? -1 : 1;
		if (a.rate !== b.rate) return a.rate < b.rate ? 1 : -1;
		return a.stage.toLowerCase() < b.stage.toLowerCase() ? -1 : 1;
	});
	return drops;
}

export function clearDropInfoCache(): void {
	_allDropInfo.length = 0;
}
import { readJsonCache } from "../cache/readJsonCache.mjs";
import { getDataPath } from "../getDataPath.mjs";
import { Role } from "./Role.mjs";

const _allRoles: Role[] = [];

export function getAllRoles(): Role[] {
	if (!_allRoles.length) {
		const cacheFilePath = getDataPath(`roles.json`);
		const allRoles = readJsonCache<Role[]>({ cacheFilePath }) ?? [];
		_allRoles.push(...allRoles);
	}
	return _allRoles;
}

export function clearRolesCache(): void {
	_allRoles.length = 0;
}

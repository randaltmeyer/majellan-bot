import { Lang } from "../types.mjs";
import { getKeyNameMap } from "./getKeyNameMap.mjs";

export function findKeyOrValue(key?: string, value?: string, lang?: Lang, partial?: boolean): string | null {
	const map = getKeyNameMap(lang);
	if (key) {
		return map.get(key) ?? null;
	}
	if (value) {
		const entries = map.entries();
		const specialChars = /[\\^$.*+?()[\]{}|]/g;
		const regexSafeValue = value.replace(specialChars, char => "\\" + char);
		const regexString = partial ? regexSafeValue : `^${regexSafeValue}$`;
		const regex = new RegExp(regexString, "i");
		for (const entry of entries) {
			if (regex.test(entry[1])) {
				return entry[0];
			}
		}
	}
	return null;
}
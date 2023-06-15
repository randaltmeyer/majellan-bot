import { Nullable, Optional } from "../types.mjs";

export function normalizeString(value: string): string;
export function normalizeString(value: Nullable<string>): Nullable<string>;
export function normalizeString(value: Optional<string>): Optional<string>;
export function normalizeString(value: Optional<string>): Optional<string> {
	if (!value) return value;
	return value
		.replace(/(&#39;)+/g, `'`)
		.replace(/[\u2018\u2019]/g, `'`)
		.replace(/[\u201C\u201D]/g, `"`)
		.replace(/[\u2013\u2014]/g, `-`)
		;
}
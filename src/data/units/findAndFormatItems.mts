import { Item } from "../../types.mjs";
import { getAll } from "../json/getAll.mjs";

export function hasItems(_unitName: string, _items: Item[]): boolean {
	return false;
}

export function findAndFormatItems(_unitName: string, _items = getAll("item")): string[] {
	return [];
}
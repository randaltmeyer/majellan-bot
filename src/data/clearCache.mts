import { clearDropInfoCache } from "./findDropsByUnit.mjs";
import { clearItemsCache } from "./getAllItems.mjs";
import { clearUnitsCache } from "./getAllUnits.mjs";
import { clearBadUrls } from "./getDqtJpData.mjs";
import { clearKeyNameMaps } from "./getKeyNameMap.mjs";

export function clearCache(): void {
	clearBadUrls();
	clearDropInfoCache();
	clearItemsCache();
	clearKeyNameMaps();
	clearUnitsCache();
}
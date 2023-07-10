import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

type AllyEntry = {

};

export type AlliesAlmanacCore = {
	/** discord user snowflake */
	userId: string;
	allies?: { [key: number]: AllyEntry; };
};

export class AlliesAlmanac {
	private constructor(private core: AlliesAlmanacCore) { }

	public save(): void {
		writeJson("almanacs", this.core.userId, this.core);
	}

	public static getOrCreate(userId: string): AlliesAlmanac {
		const core = readJson("almanacs", userId) ?? { userId };
		return new AlliesAlmanac(core);
	}
}
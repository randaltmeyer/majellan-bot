import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

type UnitEntry = {
	code: number;
	/** user has unit */
	has?: 0 | 1;
	/** awaken points */
	awkPts?: number;
	/** rank 1-8 */
	rank?: number;
	/** level 1-130 */
	level?: number;
};

export type AlliesAlmanacCore = {
	/** discord user snowflake */
	userId: string;
	units?: { [key: number]: UnitEntry; };
};

export class AlliesAlmanac {
	private constructor(private core: AlliesAlmanacCore) { }

	private get units() { return this.core.units ?? (this.core.units = {}); }

	public get count(): number {
		return Object.values(this.units).filter(entry => entry.has).length;
	}

	public has(code: number): boolean {
		return this.units[code]?.has === 1;
	}

	public setHas(code: number, has: boolean): void {
		const units = this.units;
		const entry = units[code] ?? (units[code] = { code });
		if (!entry.has !== !has) {
			entry.has = has ? 1 : 0;
			this.save();
		}
	}

	public save(): void {
		writeJson("almanacs", this.core.userId, this.core);
	}

	public static getOrCreate(userId: string): AlliesAlmanac {
		const core = readJson("almanacs", userId) ?? { userId };
		return new AlliesAlmanac(core);
	}
}
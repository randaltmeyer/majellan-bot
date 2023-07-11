import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

export type AlmanacUnitEntry = {
	code: number;
	/** user has unit */
	has?: 0 | 1;
	/** awaken 0-5 */
	awaken?: 0 | 1 | 2 | 3 | 4 | 5;
	/** awaken points */
	awakenPoints?: number;
	/** awaken plus allocation */
	awakenPlus?: { hp?:number; mp?:number; atk?:number; def?:number; agl?:number; wis?: number; }
	/** rank 1-8 */
	rank?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	/** level 1-130 */
	level?: number;
};

export type AlliesAlmanacCore = {
	/** discord user snowflake */
	userId: string;
	/** code of unit being viewed */
	activeUnit?: number;
	/** unit entries */
	units?: { [key: number]: AlmanacUnitEntry; };
};

export class AlliesAlmanac {
	private constructor(private core: AlliesAlmanacCore) { }

	private get units() { return this.core.units ?? (this.core.units = {}); }

	public get count(): number {
		return Object.values(this.units).filter(entry => entry.has).length;
	}

	public activeUnit(): number;
	public activeUnit(code: number): void;
	public activeUnit(code?: number): void | number {
		if (code === undefined) {
			return this.core.activeUnit;
		}
		if (this.core.activeUnit !== code) {
			this.core.activeUnit = code;
			this.save();
		}
	}

	public getUnit(code: number): AlmanacUnitEntry {
		return this.units[code] ?? { code };
	}

	public hasUnit(code: number): boolean;
	public hasUnit(code: number, has: boolean): void;
	public hasUnit(code: number, has?: boolean): void | boolean {
		if (has === undefined) {
			return this.units[code]?.has === 1;
		}
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
import { readJson } from "./readJson.mjs";
import { writeJson } from "./writeJson.mjs";

export type AlmanacUnitEntry = {
	id: string;
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
	activeUnit?: string;
	/** unit entries */
	units?: { [id: string]: AlmanacUnitEntry; };
};

export class AlliesAlmanac {
	private constructor(private core: AlliesAlmanacCore) { }

	private get units() { return this.core.units ?? (this.core.units = {}); }

	public get count(): number {
		return Object.values(this.units).filter(entry => entry.has).length;
	}

	public activeUnit(): string;
	public activeUnit(id: string): void;
	public activeUnit(id?: string): void | string {
		if (id === undefined) {
			return this.core.activeUnit;
		}
		if (this.core.activeUnit !== id) {
			this.core.activeUnit = id;
			this.save();
		}
	}

	public getUnit(id: string): AlmanacUnitEntry {
		return this.units[id] ?? { id };
	}

	public hasUnit(id: string): boolean;
	public hasUnit(id: string, has: boolean): void;
	public hasUnit(id: string, has?: boolean): void | boolean {
		if (has === undefined) {
			return this.units[id]?.has === 1;
		}
		const units = this.units;
		const entry = units[id] ?? (units[id] = { id });
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
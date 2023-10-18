import { verbose } from "./logger.mjs";

export class PercentLogger {
	public countComplete = 0;
	public lastInterval = 0;
	public percentComplete = 0;
	public started = false;

	public constructor(public label: string, public total = 0, public interval = 10) { }

	public start(total?: number): void {
		if (!this.started) {
			if (total !== undefined) {
				this.total = total;
			}
			if (this.total > 0) {
				verbose(`${this.label} (${this.total}) ... 0%`);
				this.started = true;
			}
		}
	}

	public increment(count = 1): void {
		this.start();
		this.countComplete += count;
		if (this.started) {
			this.percentComplete = Math.floor(100 * this.countComplete / this.total);
			if (this.percentComplete % this.interval === 0 && this.percentComplete !== this.lastInterval) {
				this.log();
				this.lastInterval = this.percentComplete;
			}
		}
	}

	public log(): void {
		if (this.started) {
			verbose(`${this.label} (${this.total}) ... ${this.percentComplete}%`);
		}
	}

	public error(message?: string): void {
		if (this.started) {
			const msg = message
				? `Error: ${message}`
				: `Error!`;
			verbose(`${this.label} (${this.total}) ... Error! ${msg}`);
		}
	}

	public finish(force100 = false): void {
		if (this.started && this.lastInterval !== 100) {
			verbose(`${this.label} (${this.total}) ... ${force100 ? 100 : this.percentComplete}%`);
		}
	}
}
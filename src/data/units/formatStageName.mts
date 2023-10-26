
export function formatStageName(nameParts: string[]): string;
export function formatStageName(nameParts: string[], removeDifficulty: true): [string, string | null];
export function formatStageName(nameParts: string[], removeDifficulty?: boolean): string | [string, string | null] {
	const filtered = nameParts
		.filter(s => s?.trim())
		.map(part => part.replace("Chapter ", "Ch. ").replace("Episode ", "Ep. ").trim());

	// if the first part is in the second part, remove the first part
	while (filtered.length > 1 && filtered[1].includes(filtered[0])) {
		filtered.shift();
	}

	// if the last part includes the part before it, remove that included part
	while (filtered.length > 1 && filtered[filtered.length - 1].includes(filtered[filtered.length - 2])) {
		filtered.splice(filtered.length - 2, 1);
	}

	// if the middle part/chapter combo is in the first and third parts, remove it
	if (filtered.length === 3) {
		const [whole, part, chapter] = /^(Part \d+) (Ch\. \d+)$/.exec(filtered[1]) ?? [];
		if (whole && filtered[0].includes(part) && filtered[2].includes(chapter)) {
			filtered.splice(1, 1);
		}
	}

	// if any part starts with a difficulty that is in a previous part, remove that redundant difficulty
	const diffRegex = /\s*(?::\s*(Very Hard|Hard|Normal)|\((Very Hard|Hard|Normal)\))/;
	for (let i = 0; i < filtered.length - 1; i++) {
		const diffMatch = diffRegex.exec(filtered[i]) ?? [];
		const difficulty = diffMatch[1] ?? diffMatch[2];
		if (difficulty && filtered[i+1].startsWith(difficulty)) {
			filtered[i+1] = filtered[i+1].slice(difficulty.length).trim();
		}
	}

	// prepare the final output
	const joined = filtered.join(" - ").trim();

	// if we want to remove a trailing difficulty (for farm lists, for instance), return it with the output
	if (removeDifficulty) {
		const diffMatch = diffRegex.exec(joined);
		if (diffMatch) {
			const difficulty = diffMatch[1] ?? diffMatch[2];
			const without = joined.replace(diffRegex, "");
			return [without, difficulty];
		}
		return [joined, null];
	}

	// return basic output
	return joined;
}

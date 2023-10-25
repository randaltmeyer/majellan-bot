export function formatStageName(nameParts: string[]): string {
	const filtered = nameParts
		.filter(s => s?.trim())
		.map(part => part.replace("Chapter ", "Ch. ").replace("Episode ", "Ep. ").trim());
	while (filtered.length > 1 && filtered[1].includes(filtered[0])) {
		filtered.shift();
	}
	while (filtered.length > 1 && filtered[filtered.length - 1].includes(filtered[filtered.length - 2])) {
		filtered.splice(filtered.length - 2, 1);
	}
	for (let i = 0; i < filtered.length - 1; i++) {
		const difficulty = (filtered[i].match(/(Normal|Very Hard|Hard)\)?$/) ?? [])[1];
		if (difficulty && filtered[i+1].startsWith(difficulty)) {
			filtered[i+1] = filtered[i+1].slice(difficulty.length).trim();
		}
	}
	return filtered.join(" - ").trim();
}

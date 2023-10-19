export function formatStageName(nameParts: string[]): string {
	const filtered = nameParts
		.filter(s => s?.trim())
		.map(part => part.replace("Chapter ", "Ch. ").replace("Episode ", "Ep. ").trim());
	if (filtered[1]?.includes(filtered[0])) {
		filtered.shift();
	}
	while (filtered.length > 1 && filtered[filtered.length - 1].includes(filtered[filtered.length - 2])) {
		filtered.splice(filtered.length - 2, 1);
	}
	return filtered.join(" - ").trim();
}
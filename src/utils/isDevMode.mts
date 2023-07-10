let _isDevMode: boolean | undefined;
export function isDevMode() {
	if (_isDevMode === undefined) {
		_isDevMode = process.argv.includes("--dev")
					|| process.env["NODE_ENV"] === "development";
	}
	return _isDevMode;
}
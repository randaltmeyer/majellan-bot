let _isDevMode: boolean | undefined;
export function isDevMode() {
	if (_isDevMode === undefined) {
		_isDevMode = process.argv.includes("--dev");
	}
	return _isDevMode;
}
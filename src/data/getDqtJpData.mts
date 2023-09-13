import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import followRedirects from "follow-redirects";

let pauseMs = 0;
export function setPauseMs(ms: number) { pauseMs = ms; }

async function pause(): Promise<void> {
	if (pauseMs) return new Promise(res => setTimeout(res, pauseMs));
}

async function getText<T = any>(url: string, postData?: T): Promise<string> {
	if (typeof(url) !== "string") {
		return Promise.reject("Invalid Url");
	}
	if (!url.match(/^https?:\/\//i)) {
		url = "https://" + url;
	}
	const protocol = url.match(/^http:\/\//i) ? followRedirects.http : followRedirects.https;
	const method = postData ? "request" : "get";
	const payload = postData ? JSON.stringify(postData) : null;
	await pause();
	return new Promise((resolve, reject) => {
		try {
			const options = payload ? {
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': payload.length,
				},
				method: "POST"
			} : { };
			const req = protocol[method](url, options, response => {
				try {
					const chunks: Buffer[] = [];
					response.on("data", (chunk: Buffer) =>
						chunks.push(chunk)
					);
					response.once("close", reject);
					response.once("end", () =>
						resolve(Buffer.concat(chunks).toString("utf8"))
					);
					response.once("error", reject);
				}catch(ex) {
					reject(ex);
				}
			});
			req.once("close", reject);
			req.once("error", reject);
			req.once("timeout", reject);
			if (method === "request") {
				req.write(payload);
				req.end();
			}
		}catch(ex) {
			reject(ex);
		}
	});
}

const badUrls: string[] = [];
export function getBadUrls(): string[] {
	return badUrls;
}
async function getDqtJpText(url: string, skipWriteCache: boolean, cacheFilePath: string, postData?: any): Promise<string | null> {
	console.log(`\t\tReading url: ${url}`);
	const text = await getText(url, postData).catch(err => {
		if (err?.code === "ECONNRESET") {
			badUrls.push(url);
			console.error("\t\t\tECONNRESET");
		}else {
			console.error(err);
		}
	});
	if (text && !skipWriteCache) {
		console.log(`\t\tWriting cache: ${cacheFilePath}`);
		const cacheDirPath = cacheFilePath.split("/").slice(0, -1).join("/");
		mkdirSync(cacheDirPath, { recursive:true });
		writeFileSync(cacheFilePath, text);
	}
	return text ?? null;
}

/** Convenience wrapper for getText(url).then(text => JSON.parse(text)) */
export function getJson<T = any>(url: string): Promise<T>;
export function getJson<T = any, U = any>(url: string, postData: U): Promise<T>;
export function getJson<T = any, U = any>(url: string, postData?: U): Promise<T> {
	return new Promise((resolve, reject) => {
		getText(url, postData).then(text => {
			try {
				resolve(JSON.parse(text));
			}catch(ex) {
				reject(ex);
			}
		}, reject);
	});
}

export async function getDqtJpHtml(type: "item" | "passive" | "skill" | "unit", code: number, skipReadCache = false, skipWriteCache = false): Promise<string> {
	const cacheDirPath = `../data/cache/${type}`;
	const cacheFilePath = `${cacheDirPath}/${code}.html`;
	if (!skipReadCache) {
		try {
			if (existsSync(cacheFilePath)) {
				// console.log(`\t\tReading cache: ${cacheFilePath}`);
				const cacheHtml = readFileSync(cacheFilePath, "utf8");
				if (cacheHtml) {
					return cacheHtml
				}
			}
		}catch(ex) {
			console.error("Error reading cache: " + cacheFilePath);
		}
	}
	const url = `https://dqtjp.kusoge.xyz/${type}/${code}`;
	const html = await getDqtJpText(url, skipWriteCache, cacheFilePath);
	return html ?? "";
}

export async function getDqtJpJs(key: string, skipReadCache = false, skipWriteCache = false): Promise<string> {
	const cacheDirPath = `../data/cache/js`;
	const cacheFilePath = `${cacheDirPath}/${key}.js`;
	if (!skipReadCache) {
		try {
			if (existsSync(cacheFilePath)) {
				// console.log(`\t\tReading cache: ${cacheFilePath}`);
				const cacheJs = readFileSync(cacheFilePath, "utf8");
				if (cacheJs) {
					return cacheJs
				}
			}
		}catch(ex) {
			console.error("Error reading cache: " + cacheFilePath);
		}
	}
	const url = `https://dqtjp.kusoge.xyz/json/${key}.js`;
	const js = await getDqtJpText(url, skipWriteCache, cacheFilePath);
	return js ?? "";
}

export async function getDqtJpJson<T = any>(key: string, method: "GET" | "POST", skipReadCache = false, skipWriteCache = false): Promise<T | null> {
	const cacheDirPath = `../data/cache/json`;
	const cacheFilePath = `${cacheDirPath}/${key}.json`;
	if (!skipReadCache) {
		try {
			if (existsSync(cacheFilePath)) {
				// console.log(`\t\tReading cache: ${cacheFilePath}`);
				const cacheJson = readFileSync(cacheFilePath, "utf8");
				if (cacheJson) {
					return JSON.parse(cacheJson);
				}
			}
		}catch(ex) {
			console.error("Error reading cache: " + cacheFilePath);
		}
	}
	const suffix = method === "GET" ? "/0" : "";
	const url = `https://dqtjp.kusoge.xyz/${key}/q${suffix}`;
	const json = await getDqtJpText(url, skipWriteCache, cacheFilePath, method === "GET" ? undefined : {})
	try {
		return json ? JSON.parse(json) ?? null : null;
	}catch(ex) {
		console.error(ex);
		return null;
	}
}

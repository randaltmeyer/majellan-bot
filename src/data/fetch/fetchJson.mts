import followRedirects from "follow-redirects";
import { PercentLogger } from "../../utils/PercentLogger.mjs";

export async function fetchJson<T = any>(url: string): Promise<T> {
	return new Promise((resolve, reject) => {
		try {
			let pLogger: PercentLogger | null = new PercentLogger(`Fetching Bytes: ${url}`, 0);
			const req = followRedirects.https.get(url, response => {
				try {
					const chunks: Buffer[] = [];
					response.on("data", (chunk: Buffer) => {
						pLogger?.increment(chunk.byteLength);
						chunks.push(chunk);
					});
					response.once("close", (ev: any) => {
						pLogger = null;
						reject(ev);
					});
					response.once("end", () => {
						pLogger?.finish();
						pLogger = null;
						try {
							const raw = Buffer.concat(chunks).toString("utf8");
							const json = JSON.parse(raw);
							resolve(json);
						}catch(ex) {
							reject(ex);
						}
					});
					response.once("error", (err: any) => {
						pLogger = null;
						reject(err);
					});
				}catch(ex) {
					pLogger = null;
					reject(ex);
				}
			});
			req.once("response", resp => pLogger?.start(+(resp.headers["content-length"] ?? 0)));
			req.once("close", (ev: any) => {
				pLogger = null;
				reject(ev);
			});
			req.once("error", (err: any) => {
				pLogger = null;
				reject(err);
			});
			req.once("timeout", (ev: any) => {
				pLogger = null;
				reject(ev);
			});
		}catch(ex) {
			reject(ex);
		}
	});
}
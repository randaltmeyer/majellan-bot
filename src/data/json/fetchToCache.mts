import followRedirects from "follow-redirects";
import { PercentLogger } from "../../utils/PercentLogger.mjs";
import { existsSync, rmSync, createWriteStream, WriteStream } from "fs";
import { verbose } from "../../utils/logger.mjs";

export async function fetchToCache(url: string, cacheFilePath: string): Promise<void> {
	return new Promise((_resolve, _reject) => {
		if (existsSync(cacheFilePath)) {
			verbose(`Removing old cache: ${cacheFilePath}`);
			rmSync(cacheFilePath);
		}
		let writeStream: WriteStream | null = createWriteStream(cacheFilePath, { encoding:"utf8" });
		let pLogger: PercentLogger | null = new PercentLogger(`Fetching Bytes: ${url}`, 0);
		const resolve = () => {
			pLogger?.finish();
			pLogger = null;
			writeStream?.close();
			writeStream = null;
			_resolve();
		};
		const reject = (err: any) => {
			pLogger?.error(err);
			pLogger = null;
			writeStream?.close();
			writeStream = null;
			_reject(err);
		};
		try {
			const req = followRedirects.https.get(url, response => {
				try {
					response.pipe(writeStream!);
					response.on("data", (chunk: Buffer) => pLogger?.increment(chunk.byteLength));
					response.once("close", reject);
					response.once("end", resolve);
					response.once("error", reject);
				}catch(ex) {
					reject(ex);
				}
			});
			req.once("response", resp => pLogger?.start(+(resp.headers["content-length"] ?? 0)));
			req.once("close", reject);
			req.once("error", reject);
			req.once("timeout", reject);
		}catch(ex) {
			reject(ex);
		}
	});

}
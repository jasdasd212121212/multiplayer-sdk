import { promisify } from 'util';
import { brotliCompress, brotliDecompress } from 'zlib';
class JsonCompressor {
    constructor() {
        this.compressPromise = promisify(brotliCompress);
        this.decompressPromise = promisify(brotliDecompress);
    }
    static init() {
        if (JsonCompressor.instance == null) {
            JsonCompressor.instance = new JsonCompressor();
        }
    }
    async stringify(input) {
        let jsonString = JSON.stringify(input);
        jsonString = await this.compressAsync(jsonString);
        return jsonString;
    }
    async parse(input) {
        let unpacked = await this.decompressAsync(input);
        return JSON.parse(unpacked);
    }
    async compressAsync(str) {
        try {
            const compressed = await this.compressPromise(str);
            return compressed.toString("base64");
        }
        catch (error) {
            console.error("Brotli compression failed:", error);
            return "";
        }
    }
    async decompressAsync(str) {
        try {
            const compressed = await this.decompressPromise(Buffer.from(str, 'base64'));
            return compressed.toString();
        }
        catch (error) {
            console.error("Brotli decompression failed:", error);
            return "";
        }
    }
}
export { JsonCompressor };
//# sourceMappingURL=JsonCompressor.js.map
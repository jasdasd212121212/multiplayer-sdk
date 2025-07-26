import { promisify } from 'util';
import { brotliCompressSync, brotliDecompressSync, brotliCompress, brotliDecompress } from 'zlib';
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
    stringify(input) {
        let jsonString = JSON.stringify(input);
        jsonString = this.compressString(jsonString);
        return jsonString;
    }
    parse(input) {
        let unpacked = this.decompressString(input);
        return JSON.parse(unpacked);
    }
    compressString(str) {
        const compressedBuffer = brotliCompressSync(str).toString('base64');
        return compressedBuffer;
    }
    decompressString(str) {
        return brotliDecompressSync(Buffer.from(str, 'base64')).toString();
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
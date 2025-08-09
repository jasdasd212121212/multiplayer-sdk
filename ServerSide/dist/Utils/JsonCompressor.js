import { promisify } from 'util';
import { brotliCompress, brotliDecompress } from 'zlib';
const nonCompressMark = "NCNC";
const nonCompressMarkSeparator = ";;;";
class JsonCompressor {
    constructor(thrashold) {
        this.compressionThrashold = 0;
        this.compressPromise = promisify(brotliCompress);
        this.decompressPromise = promisify(brotliDecompress);
        this.compressionThrashold = thrashold;
    }
    static init(compressThrashold) {
        if (JsonCompressor.instance == null) {
            JsonCompressor.instance = new JsonCompressor(compressThrashold);
        }
    }
    getFullMark() {
        return nonCompressMark + nonCompressMarkSeparator;
    }
    async stringify(input) {
        let jsonString = JSON.stringify(input);
        if (jsonString.length > this.compressionThrashold) {
            jsonString = await this.compressAsync(jsonString);
        }
        else {
            jsonString = nonCompressMark + nonCompressMarkSeparator + jsonString;
        }
        return jsonString;
    }
    async parse(input) {
        let unpacked = "";
        let splitted = [];
        let markSection = this.getMarkSection(input);
        if (markSection == nonCompressMark + nonCompressMarkSeparator) {
            splitted = input.split(nonCompressMarkSeparator);
            if (splitted[0] == nonCompressMark) {
                unpacked = splitted[1];
            }
        }
        else {
            unpacked = await this.decompressAsync(input);
        }
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
    getMarkSection(source) {
        let len = nonCompressMark.length + nonCompressMarkSeparator.length;
        return source.substring(0, len);
    }
}
export { JsonCompressor };
//# sourceMappingURL=JsonCompressor.js.map
import { brotliCompressSync, brotliDecompressSync } from 'zlib';
class JsonCompressor {
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
}
export { JsonCompressor };
//# sourceMappingURL=JsonCompressor.js.map
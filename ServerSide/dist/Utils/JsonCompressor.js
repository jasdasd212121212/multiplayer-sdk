class JsonCompressor {
    static init() {
        if (JsonCompressor.instance == null) {
            JsonCompressor.instance = new JsonCompressor();
        }
    }
    stringify(input) {
        let jsonString = JSON.stringify(input);
        //TODO: compression
        return jsonString;
    }
    parse(input) {
        let unpacked = input; // TODO: uncompression
        return JSON.parse(unpacked);
    }
}
export { JsonCompressor };
//# sourceMappingURL=JsonCompressor.js.map
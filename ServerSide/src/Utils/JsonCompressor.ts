import { brotliCompressSync, brotliDecompressSync } from 'zlib';

class JsonCompressor{
    public static instance: JsonCompressor;

    public static init(): void{
        if(JsonCompressor.instance == null){
            JsonCompressor.instance = new JsonCompressor();
        }
    }

    public stringify(input: object): string{
        let jsonString: string = JSON.stringify(input);
        jsonString = this.compressString(jsonString);

        return jsonString;
    }

    public parse(input: string): object{
        let unpacked: string = this.decompressString(input);

        return JSON.parse(unpacked);
    }

    compressString(str: string): string {
        const compressedBuffer = brotliCompressSync(str).toString('base64');
        return compressedBuffer;
    }

    decompressString(str: string): string{
        return brotliDecompressSync(Buffer.from(str, 'base64')).toString();
    }
}

export { JsonCompressor }
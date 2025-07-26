import { promisify } from 'util';
import { brotliCompressSync, brotliDecompressSync, brotliCompress, brotliDecompress } from 'zlib';

class JsonCompressor{
    public static instance: JsonCompressor;
    private compressPromise: any;
    private decompressPromise: any;

    constructor(){
        this.compressPromise = promisify(brotliCompress);
        this.decompressPromise = promisify(brotliDecompress);
    }

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

    async compressAsync(str: string): Promise<string>{
        try{
            const compressed = await this.compressPromise(str);
            return compressed.toString("base64");
        }
        catch (error){
            console.error("Brotli compression failed:", error);
            return "";
        }
    }

    async decompressAsync(str: string): Promise<string>{
        try{
            const compressed = await this.decompressPromise(Buffer.from(str, 'base64'));
            return compressed.toString();
        }
        catch (error){
            console.error("Brotli decompression failed:", error);
            return "";
        }
    }
}

export { JsonCompressor }
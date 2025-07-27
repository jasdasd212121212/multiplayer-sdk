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

    public async stringify(input: object): Promise<string>{
        let jsonString: string = JSON.stringify(input);
        jsonString = await this.compressAsync(jsonString);

        return jsonString;
    }

    public async parse(input: string): Promise<object>{
        let unpacked: string = await this.decompressAsync(input);

        return JSON.parse(unpacked);
    }

    private async compressAsync(str: string): Promise<string>{
        try{
            const compressed = await this.compressPromise(str);
            return compressed.toString("base64");
        }
        catch (error){
            console.error("Brotli compression failed:", error);
            return "";
        }
    }

    private async decompressAsync(str: string): Promise<string>{
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
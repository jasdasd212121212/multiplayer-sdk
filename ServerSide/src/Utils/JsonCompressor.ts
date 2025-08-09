import { promisify } from 'util';
import { brotliCompress, brotliDecompress } from 'zlib';

const nonCompressMark = "NCNC";
const nonCompressMarkSeparator = ";;;";

class JsonCompressor{
    public static instance: JsonCompressor;
    private compressPromise: any;
    private decompressPromise: any;
    private compressionThrashold: number = 0;

    constructor(thrashold: number){
        this.compressPromise = promisify(brotliCompress);
        this.decompressPromise = promisify(brotliDecompress);
        this.compressionThrashold = thrashold;
    }

    public static init(compressThrashold: number): void{
        if(JsonCompressor.instance == null){
            JsonCompressor.instance = new JsonCompressor(compressThrashold);
        }
    }

    public getFullMark(): string{
        return nonCompressMark + nonCompressMarkSeparator;
    }

    public async stringify(input: object): Promise<string>{
        let jsonString: string = JSON.stringify(input);

        if(jsonString.length > this.compressionThrashold){
            jsonString = await this.compressAsync(jsonString);
        }
        else{
            jsonString = nonCompressMark + nonCompressMarkSeparator + jsonString;
        }

        return jsonString;
    }

    public async parse(input: string): Promise<object>{
        let unpacked: string = "";
        let splitted: Array<string> = [];
        let markSection: string = this.getMarkSection(input);

        if(markSection == nonCompressMark + nonCompressMarkSeparator){
            splitted = input.split(nonCompressMarkSeparator);

            if(splitted[0] == nonCompressMark){
                unpacked = splitted[1];
            }
        }
        else{
            unpacked = await this.decompressAsync(input);
        }

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

    private getMarkSection(source: string): string{
        let len: number = nonCompressMark.length + nonCompressMarkSeparator.length;
        return source.substring(0, len);
    }
}

export { JsonCompressor }
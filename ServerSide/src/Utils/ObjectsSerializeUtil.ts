import { promisify } from 'util';
import { brotliCompress, brotliDecompress } from 'zlib';
import { ICompressionConfig } from '../CfgSchemas/ICompressionConfig.js';
import { CfgLoader } from '../CfgLoader/CfgLoader.js';
import { ObjectSerializeStrategy } from './Serializers/Interface/ObjectSerializeStrategy.js';

const nonCompressMark = "NCNC";
const nonCompressMarkSeparator = ";;;";

class ObjectsSerializeUtil{
    public static instance: ObjectsSerializeUtil;
    private compressPromise: any;
    private decompressPromise: any;
    private compressionThrashold: number = 0;
    private serializer: ObjectSerializeStrategy = null;

    constructor(thrashold: number, strategy: ObjectSerializeStrategy){
        this.compressPromise = promisify(brotliCompress);
        this.decompressPromise = promisify(brotliDecompress);
        this.compressionThrashold = thrashold;
        this.serializer = strategy;

        console.log(`JSON compress wrapper thrashold: ${thrashold}`);
    }

    public static init(strategy: ObjectSerializeStrategy): void{
        if(ObjectsSerializeUtil.instance == null){
            let config: ICompressionConfig = CfgLoader.instance.load<ICompressionConfig>("compression");

            ObjectsSerializeUtil.instance = new ObjectsSerializeUtil(config.compressionThrashold, strategy);
        }
    }

    public getFullMark(): string{
        return nonCompressMark + nonCompressMarkSeparator;
    }

    public async serialize(input: object): Promise<string>{
        let jsonString: string = this.serializer.serialize(input);

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

        return this.serializer.deserialize(unpacked);
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

export { ObjectsSerializeUtil }
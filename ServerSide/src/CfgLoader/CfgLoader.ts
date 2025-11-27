import { readFileSync } from "node:fs";

const CFG_FOLDER = "cfg";

export class CfgLoader {
    public static instance: CfgLoader = null;
    private basePath: string;

    public static init(basePath: string): void{
        if(CfgLoader.instance != null){
            return;
        }

        CfgLoader.instance = new CfgLoader(basePath);
    }

    constructor(basePath: string){
        this.basePath = basePath + `\\${CFG_FOLDER}`;
        console.log(`cfg loader initialized at base: ${this.basePath}`);
    }

    public load<T>(name: string): T{
        let fileContent: string = this.loadFileContent(name);

        if(fileContent !== undefined){
            return <T> JSON.parse(fileContent);
        }
    }

    private loadFileContent(name: string): string{
        try{
            return readFileSync(this.basePath + `\\${name}.json`, "utf-8");
        }
        catch(e){
            console.error(e);
            return undefined;
        }
    }
}
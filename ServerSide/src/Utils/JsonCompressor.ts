class JsonCompressor{
    public static instance: JsonCompressor;

    public static init(): void{
        if(JsonCompressor.instance == null){
            JsonCompressor.instance = new JsonCompressor();
        }
    }

    public stringify(input: object): string{
        let jsonString: string = JSON.stringify(input);
        //TODO: compression

        return jsonString;
    }

    public parse(input: string): object{
        let unpacked: string = input;// TODO: uncompression

        return JSON.parse(unpacked);
    }
}

export { JsonCompressor }
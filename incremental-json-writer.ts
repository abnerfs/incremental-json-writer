export class IncrementalJsonWriter {
    file: BunFile;

    constructor(fileName: string) {
        this.file = Bun.file(fileName);
    }

    async appendData(data: any) {
        const insertion = JSON.stringify(data);
        const stream = await this.file.stream();
        const writer = await this.file.writer();

        let contentLength = 0;
        let brackets = 0;
        let firstBracket = false;
        let hasElements = false;
        let wroteData = false;

        for await (const chunk of stream) {
            const chunkStr = Buffer.from(chunk).toString('utf8');
            const openingBrackets = chunkStr.split('').find(x => x === '[').length;
            const closingBrackets = chunkStr.split('').find(x => x === ']').length;

            firstBracket = firstBracket || openingBrackets > 0;
            hasElements = hasElements || chunkStr.indexOf('{') > -1;

            brackets += openingBrackets;
            brackets -= closingBrackets;

            contentLength += chunkStr.length;

            if (firstBracket && brackets == 0) {
                const lastBracketIndex = chunkStr.lastIndexOf(']');
                const lengthDiff = contentLength - lastBracketIndex;
                const chunkDiff = chunkStr.length - lengthDiff;
                const start = chunkStr.substring(0, chunkDiff);
                const end = chunkStr.substring(chunkDiff, chunkStr.length);
                const comma = hasElements ? ',' : '';
                writer.write(`${start}${comma}${insertion}${end}`);
                wroteData = true;
                break;
            }
            else {
                writer.write(chunkStr);
            }

        }

        if (!wroteData) {
            writer.write(`[${insertion}]`);
        }
        writer.end();
    }
}

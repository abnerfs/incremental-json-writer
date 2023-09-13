export class IncrementalJsonWriter {
    file: BunFile;

    constructor(fileName: string) {
        this.file = Bun.file(fileName);
    }

    async appendData(data: any) {
        const insertion = Array.isArray(data) ? data.map(x => JSON.stringify(x)).join(',') : JSON.stringify(data);
        const stream = await this.file.stream();
        const writer = await this.file.writer();

        let contentLength = 0;
        let brackets = 0;
        let firstBracket = false;
        let hasElements = false;
        let wroteData = false;

        for await (const chunk of stream) {
            const chunkStr = Buffer.from(chunk).toString('utf8');
            const chunkSplit = chunkStr.split('');
            const openingBrackets = chunkSplit.filter(x => x === '[').length;
            const closingBrackets = chunkSplit.filter(x => x === ']').length;

            firstBracket = firstBracket || openingBrackets > 0;
            hasElements = hasElements || chunkStr.indexOf('{') > -1;

            brackets += openingBrackets;
            brackets -= closingBrackets;

            contentLength += chunkStr.length;

            if (firstBracket && brackets == 0 && !wroteData) {
                const lastBracketIndex = chunkStr.lastIndexOf(']');
                const start = chunkStr.substring(0, lastBracketIndex);
                const end = chunkStr.substring(lastBracketIndex, chunkStr.length);
                const comma = hasElements ? ',' : '';
                writer.write(`${start}${comma}${insertion}${end}`);
                wroteData = true;
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

import { IncrementalJsonWriter } from "./incremental-json-writer";

const jsonWriter = new IncrementalJsonWriter('./huge-file.json');
await jsonWriter.appendData([{name: 'Abner'}, {name: 'Robson'}, {name: 'Adilson'}]);
await jsonWriter.appendData({name: 'Macleiton'});

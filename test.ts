import { IncrementalJsonWriter } from "./incremental-json-writer";

const jsonWriter = new IncrementalJsonWriter('./data.json');
await jsonWriter.appendData({name: 'Abner'});
await jsonWriter.appendData({name: 'Robson'});
await jsonWriter.appendData({name: 'Adilson'});

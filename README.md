# Incremental Json Writer
Proof of concept, naive incremental json writer implementation, append data to json array files without load the entire json in memory, written with [Bun](https://bun.sh/).

# Limitations
- Only works with json files that are simple arrays, no nested objects for now.
- It only appends to the end of the array.
- It doesn't care about the identation it just appends the data as it is.

# Usage
You will need [Bun](https://bun.sh/) to test it, the usage is straight forward, no dependencies needed

```javascript
import { IncrementalJsonWriter } from "./incremental-json-writer";

const jsonWriter = new IncrementalJsonWriter('./data.json');
await jsonWriter.appendData({name: 'Abner'});
await jsonWriter.appendData({name: 'Robson'});
await jsonWriter.appendData({name: 'Adilson'});
```

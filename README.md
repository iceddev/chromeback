# chromeback
Mapping of Chrome APIs to node-style callbacks

## Usage
```
var chromeApi = require('chromeback');

chromeApi.storage.sync.get('myItem', function(err, res){
  if(err){
    console.log('You would have had to check chrome.runtime.lastError to see this before!');
  }
  return res;
}
```

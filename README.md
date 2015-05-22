# chromeback
Mapping of Chrome APIs to node-style callbacks

## Usage
```
var chromeApi = require('chromeback')(chrome);
// alternatively you can specify a specific chrome api by doing
// var chromeStorage = require('chromeback')(chrome.storage)

chromeApi.storage.sync.get('myItem', function(err, res){
  if(err){
    console.log('You would have had to check chrome.runtime.lastError to see this before!');
  }
  return res;
}
```

'use strict';

var _ = require('lodash');

function buildApi(newApi, chromeApi){
  // Recursively goes down the chrome Api
  // First we get all the keys for the level we're on
  var keys = _.keysIn(chromeApi);

  _.forEach(keys, function(key){
    // then we loop over them and assign them
    // this first one is just a safety in case of non-objects.
    newApi[key] = chromeApi[key];

    if(_.isObject(chromeApi[key])){
      // If we hit an object we want to go down inside of it
      // Cloning it so we recursively call the function again
      newApi[key] = buildApi({}, chromeApi[key]);
    }

    if(_.isFunction(chromeApi[key])){
      // Aha! A function here the real fun begins
      newApi[key] = _.restParam(function(args){
        var lastElement = _.last(args);

        if(_.isFunction(lastElement)){
          // If the last element of the arguments array is a function we assume it's a callback and remove it
          var callback = lastElement;
          args.pop();

          // Then we replace it with our own function which handles the error cases
          var replacementCallback = _.restParam(function(res){
            if(chrome.runtime.lastError){
              return callback(chrome.runtime.lastError);
            } else {
              return callback.apply(null, [null].concat(res));
            }
          });
          // Then call the Chrome api with all of the original arguments plus our new callback(Which eventually calls the old callback)
          return chromeApi[key].apply(chromeApi, args.concat(replacementCallback));
        } else {
          // Callbacks are optional in a lot of cases. If we weren't given one we just call the api normally.
          return chromeApi[key].apply(chromeApi, args);
        }
      });
    }
  });

  return newApi;
}

var createdApi = buildApi({}, chrome);

module.exports = createdApi;

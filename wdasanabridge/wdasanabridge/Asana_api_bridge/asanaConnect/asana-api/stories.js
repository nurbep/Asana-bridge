/*
 * stories.js: Methods for the stories resource.
 *
 * (C) 2012 Charlie Robbins.
 *
 */

var Stories = exports.Stories = function (client) {
  this.client = client;
};

Stories.prototype.list = function(taskid, callback){
    console.log("listing stories functions");
    return this.client.request('/tasks/' + taskid + '/stories', callback, function (res, result) {
    callback(null, result.data);
  });
};

Stories.prototype.get = function(storyid, callback){
    console.log("retrieving single story function");
    return this.client.request('/stories/'+storyid, callback, function (res, result) {
        callback(null, result.data);
    });
};
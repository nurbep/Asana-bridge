
var Attachments = exports.Attachments = function(client) {
    this.client = client;
};

Attachments.prototype.get = function (attachment, callback){
    return this.client.request('/attachments/'+attachment, callback, function(res, result){
        callback(null, result.data);
    });
};

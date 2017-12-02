

var Client = require('./asana-api/client').Client;

exports.createClient = function (options) {
  return new Client(options); 
};

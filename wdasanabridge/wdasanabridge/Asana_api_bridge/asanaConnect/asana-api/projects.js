

var Projects = exports.Projects = function (client) {
  this.client = client;
};

Projects.prototype.list = function (callback) {
  return this.client.request('/projects', callback);
};

Projects.prototype.tasks = function (project, callback) {
  return this.client.request('/projects/' + project + '/tasks', callback, function (res, result) {
    callback(null, result.data);
  });
};

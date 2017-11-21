/*
 * tasks.js: Methods for the tasks resource.
 *
 * (C) 2012 Charlie Robbins.
 *
 */

var Tasks = exports.Tasks = function (client) {
  this.client = client;
};

Tasks.prototype.get = function (task, callback) {
  return this.client.request('/tasks/' + task, callback, function (res, result) {
    callback(null, result.data);
  });
};

// expects taskData to contain
// name, notes, due_on, assignee, assignee_status
// as per
// http://developer.asana.com/documentation/#tasks
//
// projectId may be null, a single projectId, or an array of projectIds.
//
Tasks.prototype.create = function(workspaceId, projectId, taskData, callback) {
  taskData.workspace = workspaceId;

  var options = {
    method: "POST",
    path: "/tasks",
    body: {data: taskData}
  };

  var self = this;
  return this.client.request(options, function(res, result) {
    if (!result)
      return callback(res.result.errors);

    var task = result;

    // no project to add it to? that is a bit weird but ok
    if (!projectId)
      return callback(null, task);

    self.client.request({
      method: "POST",
      path: "/tasks/" + result.id + "/addProject",
      body: {data: {project: projectId}}
    }, function(res, result) {
      if (!result)
        return callback(res.result.errors);

      callback(null, task);
    });
  });
};

Tasks.prototype.edit = function(taskId, taskData, callback) {
    console.log("-------------\nEditing function taskdata:\n"+JSON.stringify(taskData)+"\n-------------");
  var options = {
    method: "PUT",
    path: "/tasks/" + taskId,
    body: {data: taskData}
  };

  var self = this;
  return this.client.request(options, function(res, result) {
    if (!result)
      return callback(res.result.errors);
    var task = result;
    callback(null, task);
  });
};

/*
 * Added by mcabe 2014-09-17 kris.m.wiredelta@gmail.com
 */
Tasks.prototype.comment = function(taskId, comment, callback) {
    console.log("-------------\ncommenting function comment:\n"+comment+"\n-------------");
    var options = {
        method: "POST",
        path: "/tasks/" + taskId + "/stories",
        body: {data : {text : comment} }
    };

    var self = this;
    return this.client.request(options, function(res, result) {
        if(!result)
            return callback(res.result.errors);
        callback(null, result);
    });
};

/*
 * Added by mcabe 2014-09-15 kris.m.wiredelta@gmail.com
 */
Tasks.prototype.remove = function(taskId, callback) {
    console.log("-------------\ntask deletion function taskid:\n"+taskId+"\n-------------");
    var options = {
        method: "DELETE",
        path: "/tasks/" + taskId
    };

    var self = this;
    return this.client.request(options, function(res, result) {
        console.log("-------------\nres: "+res);
        console.log("result: "+result+"\n-------------");
        if (!result)
            callback(null, result);
            //return callback(res.result.errors);
        callback(null, result);
    });
};





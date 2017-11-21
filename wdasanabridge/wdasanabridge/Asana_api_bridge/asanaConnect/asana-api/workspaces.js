/*
 * workspaces.js: Methods for the workspaces resource.
 *
 * (C) 2012 Charlie Robbins.
 *
 */

var Workspaces = exports.Workspaces = function (client) {
  this.client = client;
};

Workspaces.prototype.list = function (callback) {
    console.log("Fetching all workspaces");
    return this.client.request('/workspaces', callback);
};

/*
 * Added by mcabe 2014-09-11 kris.m.wiredelta@gmail.com
 */
Workspaces.prototype.projects = function (wordspaceID, callback) {
    console.log("Searching projects from workspace: "+wordspaceID);
    return this.client.request('/workspaces/'+wordspaceID+'/projects', callback);
};

/*
 * Added by mcabe 2014-09-25 kris.m.wiredelta@gmail.com
 */
Workspaces.prototype.teams = function (wordspaceID, callback) {
    console.log("Searching teams from workspace: "+wordspaceID);
    return this.client.request('/organizations/'+wordspaceID+'/teams', callback);
};

Workspaces.prototype.tasks = function (options, callback) {
  return this.client.request({
    path: '/tasks',
    query: options
  }, callback);
};
/**
 * Created by krismaini on 08/09/14.
 */
var asana = require('../Asana_api_bridge/asanaConnect/asana'),
    http = require('http'),
    express = require("express"),
    app = express();

var client,
    clientId,
    tempTask,
    tempTasks,
    tempTaskId,
    tempNewTaskId,
    tempTaskAttachments,
    tempTaskAttachmentsData,
    tempTaskStories,
    tempTaskStory,
    tempNewStories,
    tempAllProjects,
    tempOrgTeams;

var connectClient = function (key, callback) {
    /*
     * Could be used initially to verify valid client API key
     */
    client = asana.createClient({
        apiKey: key
    });
    if (!client) {
        callback(false);
    } else {
        /*if (!client) {
            callback(false);
        }*/
        callback(true);
    }
};

var createTask = function(workspace, project, taskname, tasknote, callback) {
    client.tasks.create(workspace, project, {
        "name": taskname,
        "notes": tasknote
    }, function (err, task) {
        if (err) {
            callback(false);
        } else {
            console.log(task);
            callback(task);
        }
    });
};

var getAllTasks = function (projectid, callback) {
    client.projects.tasks(projectid, function (err, tasks) {
        if (err) {
            callback(false);
        } else {
            
            tempTasks = tasks;
            console.log(tasks);
            callback(tasks);
        }
    });
};

var getTask = function (taskid, callback) {
    client.tasks.get(taskid, function (err, task) {
        if (err) {
            callback(false);
        } else {
            console.log(task);
            tempTask = task;
            callback(task);
        }
    });
};

var getTaskAttachments = function (task, callback) {
    if (!tempTasks) {
        client.tasks.get(task.id + "/attachments", function (err, attachments) {
            if (err) {
                callback(false);
            } else {
                tempTaskAttachments = attachments;
                callback(attachments);
            }
        });
    } else {
        for (var i = 0; i < tempTasks.length; i++) {
            if (task.name == tempTasks[i].name) {
                tempTaskId = tempTasks[i].id;
            }
        }
        client.tasks.get(tempTaskId + "/attachments", function (err, attachments) {
            if (err) {
                callback(false);
            } else {
                tempTaskAttachments = attachments;
                callback(attachments);
            }
        });
    }
};

var getAttachmentsData = function (attachments, callback) {
    tempTaskAttachmentsData = [];
    console.log(attachments);
    for (var i = 0; i < attachments.length; i++) {
        client.attachments.get(attachments[i].id, function (err, attachment) {
            console.log(attachment);
            if (err) {
                callback(false);
            } else {
                tempTaskAttachmentsData.push(attachment);
            }
            if (tempTaskAttachmentsData.length == attachments.length) {
                callback(true);
            }
        });
    }
};

var getTaskStories = function (taskid, callback) {
    client.stories.list(taskid, function (err, stories) {
        if (err) {
            callback(false);
        } else {
            tempTaskStories = stories;
            callback(stories);
        }
    });
};

var getTaskStory = function (callback) {
    tempNewStories = [];
    for (var i = 0; i < tempTaskStories.length; i++) {
        tempTaskStory = tempTaskStories[i].created_at + "\n" + tempTaskStories[i].created_by.name + "\n" + tempTaskStories[i].text + "\n" + tempTaskStories[i].type;
        console.log("-----------------------\nTemp comment to be added to array:\n" + tempTaskStory + "\n-----------------------");
        tempNewStories.push(tempTaskStory);
    }
    if (tempNewStories.length > 0) {
        callback(true);
    } else {
        callback(false);
    }
};

var getProjects = function (workspaceid, callback) {
    client.workspaces.projects(workspaceid, function (err, projects) {
        if (err) {
            callback(false);
        } else {
            tempAllProjects = projects;
            console.log(projects);
            callback(projects);
        }
    });
};

var getWorkSpaces = function (callback) {
    client.workspaces.list(function (err, workSpaces) {
        if (err) {
            callback(false);
        } else {
            console.log(workSpaces);
            callback(workSpaces);
        }
    });
};

var getTeams = function (workspaceid, callback) {
    console.log("Searching for teams from workspace: "+workspaceid);
    client.workspaces.teams(workspaceid, function (err, teams) {
        if (err) {
            callback(false);
        } else {
            tempOrgTeams = teams;
            callback(teams);
        }
    })
};

var copyTask = function (workspaceId, projectId, taskid, callback) {
    getTask(taskid, function (result) {
        if (!result) {
            callback(false);
        } else {
            var taskData = {
                "name": tempTask.name,
                "notes": tempTask.notes,
                "due_on": tempTask.due_on,
                "assignee": tempTask.assignee,
                "assignee_status": tempTask.assignee_status
            };
            console.log("-------------\nCopying:\n" + JSON.stringify(taskData) + "\n-------------");
            client.tasks.create(workspaceId, projectId, taskData, function (err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
};

/*var checkCopied = function(taskname, projectid, workspaceid, callback){
    client.projects.tasks(projectid, function(err, tasks){
        if(err) {
            callback(false)
        } else {
            console.log("-------------\nIs "+JSON.stringify(taskname)+" in "+JSON.stringify(tasks)+"?");

            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].name == taskname) {
                    console.log(tasks[i].name+"\n-------------");
                    tempNewTaskId = tasks[i].id;
                    callback(true);
                } else {
                    callback(false);
                }
            }
        }
    });
};*/

var editNewTask = function (taskid, callback) {
    var dlURLs = tempTask.notes;
    console.log(dlURLs);
    for (var i = 0; i < tempTaskAttachmentsData.length; i++) {
        dlURLs += ("\n" + tempTaskAttachmentsData[i].name + ": " + tempTaskAttachmentsData[i].view_url);
        console.log(dlURLs);
    }

    var taskData = {
        "notes": dlURLs
    };
    console.log(taskData);
    client.tasks.edit(taskid, taskData, function (err, task) {
        if (err) {
            callback(false);
        } else {
            callback(task);
        }
    });
};

var commentNewTask = function (taskid, callback) {
    for (var i = 0; i < tempNewStories.length; i++) {
        client.tasks.comment(taskid, tempNewStories[i], function (err, comment) {
            if (err) {
                console.log("-----------------------\nComment failed!\n" + JSON.stringify(err) + "\n-----------------------");
                callback(false);
            } else {
                console.log("-----------------------\nCreated new comment\n" + comment + "\n-----------------------");
                if (i >= tempNewStories.length) {
                    callback(true);
                }
            }
        });
    }
};

var deleteOldTask = function (taskid, callback) {
    console.log("-------------\nId of task to be deleted: " + taskid + "\n-------------");
    client.tasks.remove(taskid, function (err, result) {
        if (err) {
            console.log("-------------\nDeletion failed!\n" + JSON.stringify(err) + "\n-------------");
            callback(false);
        } else {
            console.log("-------------\nDeleted old task:\n" + JSON.stringify(result) + "\n-------------");
            callback(true);
        }
    });
};

// retrieves all teams from all workspaces for a given asana key
function getWorkspacesTeams(workspaces, index, listTeams, callback) {

    console.log("Run no.: "+(index+1)+"\nOn workspaceID: "+workspaces[index].id);
    getTeams(workspaces[index].id, function (teams) {
        console.log("Got these teams: "+JSON.stringify(teams));
        if (!teams) {
            if (++index < workspaces.length)
                getWorkspacesTeams(workspaces, index, listTeams, callback);
            else
                callback(listTeams);
        } else {
            if (++index < workspaces.length)
                getWorkspacesTeams(workspaces, index, listTeams.concat(teams), callback);
            else
                callback(listTeams.concat(teams));
        }
    });

}


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "content-Type,x-requested-with");
    next();
});
/*
 * requires header key:
 * 1. user API key: { key : 0123456789 }
 */
app.get("/connectClient", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                res.status(200).send("Client (" + req.param('key') + ") connected successfully......");
            }
        });
    }
});

/*
 * requires header key: 24235247
 * 1. user API key: { key : 0123456789 }
 * unlike teams, this endpoint will return all teams from all workspaces associated with this asana key
 */
app.get('/workspaces-teams', function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                getWorkSpaces(function (result) {
                    if (!result) {
                        res.status(404).send("Error fetching workspaces for client: " + clientId);
                    } else {
                        getWorkspacesTeams(result, 0, [], function (result) {
                            if (!result) {
                                res.status(404).send("Error fetching teams for client: " + clientId);
                            } else {
                                res.status(200).send(result);
                            }
                        });

                    }
                });
            }
        });
    }
});
/*
 * requires header key:
 * 1. user API key: { key : 0123456789 }
 */
app.get("/workspaces", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                getWorkSpaces(function (result) {
                    if (!result) {
                        res.status(404).send("Error fetching workspaces for client: " + clientId);
                    } else {
                        res.status(200).send(result);
                    }
                });
            }
        });
    }
});

/*
 * requires header keys:
 * 1. user API key: { key : 0123456789 }
 * 2. workspaceID: { workspaceID : 0123456789 }
 */
app.get("/teams", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                if (!req.param('workspaceID')) {
                    res.status(500).send("Missing workspace ID.");
                } else {
                    getTeams(req.param('workspaceID'), function (result) {
                        if (!result) {
                            res.status(404).send("Error fetching teams")
                        } else {
                            res.status(200).send(result);
                        }
                    });
                }

            }
        });
    }
});

/*
 * requires following keys:
 * 1. user API key: { key : 0123456789 }
 * 2. workspaceID: { workspaceID : 0123456789 }
 */
app.get("/projects", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                if (!req.param('workspaceID')) {
                    res.status(500).send("Missing workspace ID.");
                } else {
                    getProjects(req.param('workspaceID'), function (result) {
                        if (!result) {
                            res.status(404).send("Error fetching projects from workspace: " + req.param('workspaceID'));
                        } else {
                            res.status(200).send(result);
                        }
                    });
                }
            }
        });
    }
});

/*
 * requires following keys:
 * 1. user API key: { key : 0123456789 }
 * 1. projectID: { projectID : 0123456789 }
 */
app.get("/tasks", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                if (!req.param('projectID')) {
                    res.status(500).send("Missing project ID.");
                } else {
                    getAllTasks(req.param('projectID'), function (data) {
                        if (!data) {
                            res.status(404).send("Error fetching tasks from project: " + req.param('projectID'));
                        } else {
                            res.status(200).send(data);
                        }
                    });
                }
            }
        });
    }
});

/*
 * requires following keys:
 * 1. user API key: { key : 0123456789 }
 * 2. taskID: { taskID : 0123456789 }
 */
app.get("/task", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        if (!req.param('taskID')) {
            res.status(500).send("Missing task ID.");
        } else {
            clientId = req.param('key');
            var taskId = req.param('taskID');
            connectClient(clientId, function (result) {
                if (!result) {
                    res.status(404).send("Problem connecting client: " + req.param('key'));
                } else {
                    getTask(taskId, function (result) {
                        if (!result) {
                            res.status(404).send("Problem fetching task: " + req.param('taskID'));
                        } else {
                            res.status(200).send(result);
                        }
                    });
                }
            });
        }
    }
});
app.get("/",function(req,res)
    {

        res.render("./example.html");
    });

/*
 * requires following keys:
 * 1. user API key: { key : 0123456789 }
 * 2. The destination workspace: { workspaceDestination : workspaceid }
 * 3. The destination project(if any): { projectDestination : projectid }
 * 4. task data:
 *  4.a task name: { taskname : name }
 *  4.b task notes: { notes : say something here}
 */
app.get("/createTask", function (req, res) {
    if (!req.param('key')) {
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                if (!req.param('workspaceDestination') || !req.param('projectDestination') || !req.param('taskname') || !req.param('notes')) {
                    if (!req.param('workspaceDestination')) res.status(500).send("Missing ID for destination workspace.");
                    if (!req.param('projectDestination')) res.status(500).send("Missing ID for destination project.");
                    if (!req.param('taskname')) res.status(500).send("Missing task name.");
                    if (!req.param('notes')) res.status(500).send("Missing task notes.");
                } else {
                    createTask(req.param('workspaceDestination'), req.param('projectDestination'), req.param('taskname'), req.param('notes'), function (result) {
                        if (!result) {
                            res.status(404).send("Error creating task: " + req.param('taskname'));
                        } else {
                            res.status(201).send("Successfully created task: " + req.param('taskname') +" Task created: "+ JSON.stringify(result));
                        }
                    });
                }
            }
        });
    }
});

/*
 * requires following keys:
 * 1. user API key: { key : 0123456789 }
 * 2. The task to be moved: { task : taskid }
 * 3. The destination workspace: { workspaceDestination : workspaceid }
 * 4. The destination project(if any): { projectDestination : projectid }
 */
app.get("/moveTask", function (req, res) {
    if (!req.param('key')) {
        console.log("-------------\nResponded 500: client API key\n-------------");
        res.status(500).send("Missing client API key.");
    } else {
        clientId = req.param('key');
        connectClient(clientId, function (result) {
            if (!result) {
                console.log("-------------\nResponded 404: connecting client\n-------------");
                res.status(404).send("Problem connecting client: " + req.param('key'));
            } else {
                if (!req.param('task') || !req.param('workspaceDestination') || !req.param('projectDestination')) {
                    console.log("-------------\nResponded 500: destination/task IDs\n-------------");
                    res.status(500).send("Missing taskID, workspaceID and/or project ID.");
                } else {
                    var task = req.param('task');
                    var workspace = req.param('workspaceDestination');
                    var project = req.param('projectDestination');

                    getTask(task, function (taskToBeMoved) {
                        if (!taskToBeMoved) {
                            console.log("-------------\nResponded 404: fetching task\n-------------");
                            res.status(404).send("Error fetching task (" + task.name + ").");
                        }
                        /*
                         * Now fetches all relevant task data to be moved
                         */
                        else {
                            getTaskStories(taskToBeMoved.id, function (result) {
                                if (!result) {
                                    console.log("-------------\nResponded 404: fetching stories\n-------------");
                                    res.status(404).send("Error fetching stories for task (" + taskToBeMoved.name + ").");
                                } else {
                                    getTaskStory(function (result) {
                                        if (!result) {
                                            console.log("-------------\nResponded 404: copying all story data\n-------------");
                                            res.status(404).send("Could not copy all stories from task (" + taskToBeMoved.name + ").");
                                        } else {
                                            getTaskAttachments(taskToBeMoved, function (attachments) {
                                                if (!attachments) {
                                                    console.log("-------------\nResponded 404: fetching attachments\n-------------");
                                                    res.status(404).send("Error fetching attachments for task (" + task.name + ").");
                                                } else {
                                                    if (attachments.length < 1) {
                                                        console.log("-------------\nNo attachments detected\n-------------");
                                                        copyTask(workspace, project, task, function (result) {
                                                            if (!result) {
                                                                console.log("-------------\nResponded 404: copying the task\n-------------");
                                                                res.status(404).send("Error copying task (" + taskToBeMoved.name + ").");
                                                            } else {
                                                                //checkCopied(taskToBeMoved.name, project, workspace, function(result){
                                                                //if(!result){
                                                                //    console.log("-------------\nResponded 404: checking if copy was made\n-------------");
                                                                //    res.status(404).send("Server was checking if task was copied: Failed to copy task ("+taskToBeMoved.name+").");
                                                                //} else {
                                                                deleteOldTask(taskToBeMoved.id, function (result) {
                                                                    if (!result) {
                                                                        console.log("-------------\nResponded 404: deleting old task\n-------------");
                                                                        res.status(404).send("Error deleting old task (" + taskToBeMoved.name + ").");
                                                                    } else {
                                                                        console.log("-------------\nResponded 200: Success!\n-------------");
                                                                        res.status(201).send("Task (" + taskToBeMoved.name + ") moved successfully to project (" + project + ") in workspace (" + workspace + ")!");
                                                                    }
                                                                });
                                                                //}
                                                                //});
                                                            }
                                                        });
                                                    } else {
                                                        console.log("-------------\nDetected attachments!\n-------------");
                                                        getAttachmentsData(attachments, function (result) {
                                                            if (!result) {
                                                                console.log("-------------\nResponded 404: fetching attachments URLs\n-------------");
                                                                res.status(404).send("Error fetching URLs for attachments:\n" + JSON.stringify(attachments));
                                                            } else {
                                                                copyTask(workspace, project, task, function (result) {
                                                                    if (!result) {
                                                                        console.log("-------------\nResponded 404: copying task\n-------------");
                                                                        res.status(404).send("Error copying task (" + taskToBeMoved.name + ").");
                                                                    } else {
                                                                        //checkCopied(taskToBeMoved.name, project, workspace, function(result){
                                                                        //if(!result){
                                                                        //    console.log("-------------\nResponded 404: checking if copy was made\n-------------");
                                                                        //    res.status(404).send("Server was checking if task was copied: Failed to copy task ("+taskToBeMoved.name+").");
                                                                        //} else {
                                                                        editNewTask(tempTask.id, function (result) {
                                                                            if (!result) {
                                                                                console.log("-------------\nResponded 404: adding attachments to new task\n-------------");
                                                                                res.status(404).send("Error adding attachments to task copy (" + taskToBeMoved.name + ").");
                                                                            } else {
                                                                                commentNewTask(tempNewTaskId, function (result) {
                                                                                    if (!result) {
                                                                                        console.log("-------------\nResponded 404: adding comments to copy\n-------------");
                                                                                        res.status(404).send("Error adding comments to task copy (" + taskToBeMoved.name + ").");
                                                                                    } else {
                                                                                        deleteOldTask(taskToBeMoved.id, function (result) {
                                                                                            console.log("-------------\nFinal:\n" + result + "\n-------------");
                                                                                            if (!result) {
                                                                                                console.log("-------------\nResponded 404: deleting old task\n-------------");
                                                                                                res.status(404).send("Error deleting old task (" + taskToBeMoved.name + ").");
                                                                                            } else {
                                                                                                console.log("-------------\nResponded 201: success\n-------------");
                                                                                                res.status(201).send("Task (" + taskToBeMoved.name + ") moved successfully to project (" + project + ") in workspace (" + workspace + ")!");
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                        //}
                                                                        //});
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }

                    });
                }
            }
        });
    }
});

http.createServer(app).listen(9000);
console.log('Server running at http://localhost:9000/');

module.exports.connectClient = connectClient;
module.exports.createTask = createTask;
module.exports.getAllTasks=getAllTasks;
module.exports.getTask=getTask;
module.exports.getWorkSpaces=getWorkSpaces;
module.exports.getProjects=getProjects;
module.exports.copyTask=copyTask;
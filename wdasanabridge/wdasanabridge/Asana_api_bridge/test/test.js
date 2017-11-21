var mocha = require('mocha'),
	server = require('../server.js'),
	assert = require("assert");

describe("test connect client",function(){
	it("should have function connectClient",function(done){
		assert.equal(typeof server.connectClient, 'function');
		done();

	});
	it("should return true", function(done){
		server.connectClient("57AsAE5I.0ZAC5c1JI0Dov8hwV2mF5WV", function(result){
			assert.equal(result, true);
			done();
		});
	});

	it("should return false", function(done){
		server.connectClient("bad key", function(result){
			assert.equal(result, false);
			done();
		});
	});
	
   
});
describe("test create task",function(){
	it("should have function createTask",function(done){
		assert.equal(typeof server.createTask, 'function');
		done();

	});

	it("should not return object", function(done){
		server.createTask("hkl","nai","nai","nai" ,function(result){
			assert.equal(result,false);
			done();
		});
	});

    it("should return task properties", function(done){
		server.createTask("498346170860","18748801475758","myTask","I like it." ,function(result){
			if(result){
				var taskname=result.name;
				console.log(JSON.stringify(result));
				//var workspace=result.workspace.id;
				assert.equal(taskname,"myTask");
				//assert.equal(describ,"masuma 12123");
				//assert.equal(workspace,"498346170860");
			}
		});
	 });
});

describe("test for getAllTasks",function(){
	it("should have function getAllTasks",function(done){
		assert.equal(typeof server.getAllTasks, 'function');
		done();

	});

	it("should return array of tasks", function(done){
		server.getAllTasks("18748801475756",function(result){

			
			assert.equal(result.length>0,true);
			done();
		});
	});
 	it("should not return array of tasks", function(done){
		server.getAllTasks("18748801475756",function(result){

			
			assert.equal(result.length>0,false);
			done();
		});
	});
   
});

describe("test for getTask",function(){
	it("should have function getTask",function(done){
		assert.equal(typeof server.getTask, 'function');
		done();

	});

	it("should return task", function(done){
		server.getTask("20084523531593",function(result){
             console.log(result);
			var gottenTask=result.name;
			assert.equal(gottenTask=="myTask",true);
			done();
		});
	});
 	it("should not return task", function(done){
		server.getTask("20084523531593",function(result){
            console.log(result);
			var gottenTask=result.name;
			assert.equal(gottenTask=="myTask",false);
			done();
		});
	});
   
});

describe("test for getWorkSpaces",function(){
	it("should have function getWorkSpaces",function(done){
		assert.equal(typeof server.getWorkSpaces, 'function');
		done();

	});

	it("should return WorkSpaces", function(done){
		server.getWorkSpaces(function(result){

			console.log(JSON.stringify(result));
			assert.equal(result.length>0,true);
			done();
		});
	});

   it("should not  return WorkSpaces", function(done){
		server.getWorkSpaces(function(result){

			console.log(JSON.stringify(result));
			assert.equal(result.length>0,false);
			done();
		});
	});
});

describe("test for getProjects",function(){
	it("should have function getProjects",function(done){
		assert.equal(typeof server.getProjects, 'function');
		done();

	});

	it("should return array of Projects", function(done){
		server.getProjects("498346170860",function(result){

			console.log(JSON.stringify(result));
			assert.equal(result.length>0,true);
			done();
		});
	});

   it("should not return array of Projects", function(done){
		server.getProjects("498346170860",function(result){

			console.log(result);
			assert.equal(result.length>0,false);
			done();
		});
	});

});

describe("test for copyTask",function(){
	it("should have function getProjects",function(done){
		assert.equal(typeof server.copyTask, 'function');
		done();

	});

	it("should return  copyTask", function(done){
		server.copyTask("498346170860","18748801475756","20082051494001",function(result){

			console.log(JSON.stringify(result));
			assert.equal(result,true);
			done();
		});
	});

   it("should not return  copyTask", function(done){
		server.copyTask("498346170860wrong","18748801475756wrong","20082051494001wrong",function(result){

			console.log(result);
			assert.equal(result,false);
			done();
		});
	});

});



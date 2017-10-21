//Requirments
var credentials = require('./credentials.json');
var mysql=require("mysql");
var async=require("async");

//Setup Connection
credentials.host="ids";
var connection = mysql.createConnection(credentials);

//Global Variable
var dbs = new Map();
var table = new Map();
var records = [];

async.series ([
		function(callback) {
			connection.connect(function (err){
					if(err) {
							console.log("ERROR in connecting to DB");
							callback(); //go to callback;
					}
					else {
							console.log("connected to DB");
							callback(err); //move on to next function.
					}
			});
		}
],
function(err) {
		if(err) {
				console.log("ERROR: " + err);
		}
		else {
				console.log("Async Complete");
				connection.end();
		}
});

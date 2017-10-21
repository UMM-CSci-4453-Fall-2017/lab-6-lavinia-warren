//Requirments
var credentials = require('./credentials.json');
var mysql=require("mysql");
var async=require("async");

//Setup Connection
credentials.host="ids";
var connection = mysql.createConnection(credentials);

//Global Variable
var dbs = new Map();
//var table = new Map();
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
		},
		function(callback) {
			connection.query('SHOW DATABASES', function(err, rows, fields) {
					if(err) {
							console.log("ERROR in SHOW DATABASES");
							callback();
					}
					else {
							for(element in rows) {
								dbs.set(rows[element].Database, new Map());
							}
							console.log("----- SHOW DATABASES -----");
							console.log(dbs);
							console.log("----- SHOW DATABASES -----");
							callback(err);
					}
			});
		},
		function(callback) {
				console.log("----- SHOW TABLES -----");
				count = 0;
				dbs.forEach(function (item, key, mapObj) {
						query = 'SHOW TABLES in ' + key;
						connection.query(query, function(err, tables, fields) {
								count++;
								if(err) {
										console.log("ERROR in: " + query);
								}
								else {
										for (i = 0; i < tables.length; i++) {
												tableKey = 'Tables_in_' + key;
												table = tables[i][tableKey];
												old = dbs.get(key);
												old.set(table, []);
										}
								}
								if(count == dbs.size){
									console.log("----- SHOW TABLES -----");
									callback(err);
								}
						});
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
				console.log(dbs);
		}
});

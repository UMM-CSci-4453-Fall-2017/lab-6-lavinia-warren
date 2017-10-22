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
//var records = [];

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
							//console.log("----- SHOW DATABASES -----");
							//console.log(dbs);
							console.log("----- SHOW DATABASES -----");
							callback(err);
					}
			});
		},
		function(callback) {
				//console.log("----- SHOW TABLES -----");
				count = 0;
				dbs.forEach(function (item, key, mapObj) {
						query = 'SHOW TABLES in ' + key;
						connection.query(query, function(err, tables, fields) {
								count++;
								if(err) {
										console.log("ERROR in: " + query);
										callback();
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
		},
		function(callback) {
				//console.log("----- DESCRIBE TABLES -----");
				dbCount = 0;
				dbs.forEach(function (item, key, mapObj) {
						doneWithTable = false;
						tableCount = 0;
						table = dbs.get(key);
						table.forEach( function (tableItem, tableKey, tableMapObj) {
								query = 'DESCRIBE ' + key + '.' + tableKey + ';';
								connection.query(query, function (err, records, fields) {
										if(err) {
												console.log("Error: " + query);
												callback();
										}
										else {
												old = tableMapObj.get(tableKey);
												old = new Array(records.length);
												doneWithLoop = false;
												loopCount = 0;
												for(i = 0; i < records.length; i++) {

														recField = records[i].Field;
														recType = records[i].Type;

														tableObj = new Map ();
														tableObj.set('field', recField);
														tableObj.set('type', recType)

														old[i] = tableObj;

														loopCount = i;
														//console.log(tableObj);
												}
												if(loopCount == (records.length - 1)) {
														tableMapObj.set(tableKey, old);
														doneWithLoop = true;
														tableCount ++;
														//console.log("tableCount: " + tableCount + " |table.length: " + table.size);
												}
												if(tableCount == (tableMapObj.size)) {
														tableCount = 0;
														doneWithTable = true;
														dbCount ++;
														//console.log("DBCount: " + dbCount);
												}
												if(dbCount == (dbs.size)) {
														console.log("----- DESCRIBE TABLES -----");
														callback(err);
												}
										}
								});
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
				console.log();
				//console.log(dbs);
				//console.log(dbs.get('Dogxx000'));
				printMap();
		}
});

function printMap() {
		dbs.forEach( function(dbItem, dbKey, dbObj) {
				console.log('---|' + dbKey + '>');
				table = dbs.get(dbKey);
				table.forEach( function(tableItem, tableKey, tableObj) {
						console.log('......|' + tableKey + '>');
						for(i=0; i < tableItem.length; i++) {
								//console.log(tableItem[i].get('field'));
								console.log('        ' + tableItem[i].get('field') + '        ' + tableItem[i].get('type'));
						}
				});
		});
}

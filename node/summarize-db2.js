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

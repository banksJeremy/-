#!/usr/bin/env node
var server = new (require("./client.js").AsyncSqliteServer);
var util = require("util");

server.query("CREATE TABLE FOO(BAR)").then(function(d) {
	server.query("SELECT * FROM SQLITE_MASTER").then(function(d) {
		console.log("Got result")
		console.log(util.inspect(d))
	});
});




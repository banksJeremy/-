#!/usr/bin/env node
var server = new (require("./client.js").AsyncSqliteServer);
var util = require("util");

server.query("foo").then(function(d) {
	console.log("Got result")
	console.log(util.inspect(d))
}, function(){console.log("EROOR")});




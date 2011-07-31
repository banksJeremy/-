#!/usr/bin/env node
var server = new (require("./client.js").AsyncSqliteServer);
var util = require("util");
var jQuery = require("jquery");

exports.Database = function() {
	server.query(
		'CREATE TABLE "events" (' +
		'"guid"          STRING,' +
		'"owner\'s id"   INT,' +
		'"revision"      INT,' +
		'"data"          STRING,' +
		// ^ metadata | real data v
		'"time of event" REAL,' +
		'"name"          STRING' +
		')'
	)
}

jQuery.extend(exports.Database.prototype, {
	getMaximumRevision: function() {
		return server.query("SELECT \"revision\" FROM \"events\" ORDER BY \"revision\" DESC LIMIT 1").pipe(function(row) {
			return row[0];
		}).promise();
	},
	
	getAfterRevision: function(id) {
		return server.query("SELECT \"data\" FROM \"events\" WHERE \"revision\" > " + id).pipe(function(row) {
			return JSON.parse(row[0]);
		}).promise();
	}
});

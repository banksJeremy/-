#!/usr/bin/env node
var server = new (require("./sqlite-client.js").AsyncSqliteServer);
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
	getLatestRevision: function() {
		return server.query("SELECT \"revision\" FROM \"events\" ORDER BY \"revision\" DESC LIMIT 1").pipe(function(rows) {
			if (rows.length) {
				return rows[0][0];
			} else {
				return 0;
			}
		}).promise();
	},
	
	getUpdatesFrom: function(userID, revision) {
		return server.query("SELECT \"data\" FROM \"events\" WHERE \"owner's id\" = " + userID + " \"revision\" > " + id).pipe(function(rows) {
			return rows.map(function(row) { JSON.parse(row[0]) });
		}).promise();
	},
	
	postUpdates: function(userID, updates) {
		console.log(updates);
		updates.forEach(function(update) {
			server.query("INSERT INTO \"events\"(\"owner's id\", \"data\") VALUES (" + userID + ", " + JSON.stringify(JSON.stringify(update)) + ")");
		});
		
		var result = new jQuery.Deferred;
		result.resolve();
		return result;
	}
});

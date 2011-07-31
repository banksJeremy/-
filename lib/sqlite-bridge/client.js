#!/usr/bin/env node
var child_process = require("child_process"),
    jQuery = require("jquery"),
    Deferred = jQuery.Deferred;

exports.AsyncSqliteServer = function() {
	this._process = child_process.spawn("./server.py");
	this._process.stdin.setEncoding("utf8");
	this._process.stdout.setEncoding("utf8");
	this._process.stderr.setEncoding("utf8");
	
	this._chunkBuffer = [];
	this._requestsById = {};
	
	this._process.stdout.on("data", this._handleChunk.bind(this));
	this._process.stderr.pipe(process.stderr);
}

jQuery.extend(exports.AsyncSqliteServer.prototype, {
	query: function(query, callback) {
		var result = new Deferred;
		var id = String(Math.random());
		
		this._process.stdin.write(JSON.stringify({
			id: id,
			method: "query",
			params: { query: query }
		}) + "\n");
		
		this._requestsById[id] = result;
		
		return result.promise();
	},
	
	_handleChunk: function(chunk) {
		if (chunk.indexOf("\n") > -1) {
			var splitted = chunk.split("\n", 1);
			var line = this._chunkBuffer.join("") + splitted[0];
			
			this._chunkBuffer = [splitted[1]];
			this._handleLine(line);
		} else {
			this._chunkBuffer.push(chunk);
		}
	},
	
	_handleLine: function(line) {
		var response = JSON.parse(line);
		var deferred = this._requestsById[response.id];
		delete this._requestsById[response.id];
		
		if (response.error == null) {
			deferred.resolve(response.result);
		} else {
			deferred.reject(response.error);
		}
	}	
})

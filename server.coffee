#!/usr/bin/env coffee
###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Server
###

http = require "http"

class ServerController extends http.Server
	constructor: (args...) ->
		super args...
		@on "request", (args...) => @handleRequest args...
	
	handleRequest: (req, res) ->
		switch request.path
			when "/client_api/0.1/authenticate"
				res.writeHead 200, "Content-type": "text/json"
				res.write JSON.stringify status: "logged-in"
			
			when "/"
				res.writeHead 200, "Content-type": "text/html"
				res.write """<!doctype html><script src="app.c.js"></script>"""
			
			when "/app.c.js"
				res.writeHead 200, "Content-type": "application/javascript"
				res.write fs.readFileSync "app.c.js"
			
			else
				res.writeHead 404
			
		res.end()
	
	reply: (data) ->
		res.write JSON.stringify
	
	authenticate: (username, password) ->
		if username and password
			if verify username, password
				status = "logged-in"
			else
				status = "invalid-login"
		else if check_cookie()
			status = "logged-in"
		else
			status = "log-in"
		return @reply status
		
	verify: (username, password) ->
		username == "joey" and password == "password" or 
		username == "jeremy" and password == "password"

# launch server
console.log "Launching server on :1234"
server = new ServerController
server.listen 1234, ""

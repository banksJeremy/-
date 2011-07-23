#!/usr/bin/env coffee
###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Server
###

[hostname, port] = ["", 1234]

handleRequest = (req, res) ->
	if request.path == "/client_api/0.1/"
		res.writeHead 200
		res.write JSON.stringify status: "logged-in"
		res.end()

# launch server

http = require "http"
server = http.createServer handleRequest
server.listen port, server

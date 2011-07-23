#!/usr/bin/env coffee
###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Server
###

http = require "http"
url = require "url"

class ClientAPI_0_1
    
    @authenticate: (username, password) ->
		if username and password
			if verify username, password
				status = "logged-in"
			else
				status = "invalid-login"
		else if check_cookie()
			status = "logged-in"
		else
			status = "log-in"
		return status
		
	@verify: (username, password) ->
		username is "joey" and password is "password" or 
		username is "jeremy" and password is "password"

class ServerController
	constructor: ->
		console.log "MAKING SERVER"
		@server = http.createServer (req, res) =>
			console.log "GOT"
			@handleRequest req, res
	
	listen: ->
		console.log "LISTENING, lISTENING"
		@server.listen 1234, "localhost"
	
	handleRequest: (req, res) ->
		console.log "Loading #{req}"
		
		path = url.parse req.path
		
        paths = path.pathname.split(/\//g).filter (value) -> value.length > 0
        
        a/b/
         /a/b / /
        
        
        reddit.com/.xml <--
        
        while paths.length and paths[0].length is 0
            # while the first path element is empty
            paths.shift() # discard it
        
        if not paths.length
            paths = ["index.html"]
            
            
            when "index.html"
				res.writeHead 200, "Content-type": "text/html"
				res.write """<!doctype html><script src="app.c.js"></script>"""
            when "app.c.js"
				res.writeHead 200, "Content-type": "application/javascript"
				res.write fs.readFileSync "app.c.js"

            else
                res.writeHead 404
        
        res.end()
	
	reply: (data) ->
		res.write JSON.stringify
	
	

# launch server
console.log "Launching server on :1234"
server = new ServerController
server.listen()

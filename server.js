#!/usr/bin/env node
/*
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Server
*/

require("./util.js");
var Service = require("./service.js");

var http = require("http");
var url = require("url");
var fs = require("fs");
var jquery = require("jquery");

var ClientAPI = {

	doRequest: function (session_id, postData, response) {  
		var user_id = 1;  
		if (methods.hasOwnProperty(postData.method)) {
			ClientAPI.methods[postData.method](user_id, postData.params);
			response.writeHead(200);
		}
	},
	
	methods: {		
		sync: function(user_id, params, response) {
			var deferred = Service.sync(user_id, params.fromRevision, params.updates);
            deferred.then(function(updates) {
                response.writeHead(updates.head);
                response.write(updates.body);
            });
		}
	}

};

var ServerController = (function() {

	function ServerController() {
		console.log("MAKING SERVER");
		this.server = http.createServer((function(req, res) {
			console.log("GOT");
			this.handleRequest(req, res);
		}).bind(this));
	}
	
	ServerController.prototype.listen = function() {
		console.log("LISTENING, lISTENING");
		return this.server.listen(1235, "localhost");
	};
	
	ServerController.prototype.handleRequest = function(req, res) {
        
        var postData = [];
        req.setEncoding("utf8");
        req.on("data", function(chunk) {
            postData.push(chunk);
        });
        
        req.on("end", function () {
    
            
            if (req.method == "POST") {
                try {
                    postData = JSON.parse(postData.join("")); 
                } catch (e) {
                	console.log(e)
                	console.log(postData)
                    res.writeHead(400);
                    return res.end();
                }
            }
    
            var path, paths;
            console.log("Loading " + req);
            path = url.parse(req.url);
            paths = path.pathname.split(/\//g).filter(function(value) {
                return value.length > 0;
            });
            while (paths.length && paths[0].length === 0) {
                paths.shift();
            }
            if (!paths.length) {
                paths = ["index.html"];
            }
            
            var cookies = req.headers.cookie;
            if (cookies) {
                cookies = cookies.split(";");
            
                for (var i = 0; i < cookies.length; i++) {
                    cookie = cookies[i].strip().split("=");
                    cookies[cookie[0]] = cookie[1];
                }
            } else {
                cookies = {};
            }

            switch (paths[0]) {
                case "build_tools":
                    res.writeHead(200, {
                        "Content-type": "application/javascript"
                    });
                    res.write(fs.readFileSync(paths.join("/")));
                    res.end();
                    break;
                case "index.html":
                    res.writeHead(200, {
                        "Content-type": "text/html"
                    });
                    res.write(fs.readFileSync("index.html"));
                    res.end();
                    break;
                case "app.js":
                    res.writeHead(200, {
                        "Content-type": "application/javascript"
                    });
                    res.write(fs.readFileSync("app.js"));
                    res.end();
                    break;
                case "api":
					ClientAPI.doRequest(cookies.session_id, postData, res);
                default:
                    res.writeHead(404);
                    res.end();
            }
        });	
    }
    
	ServerController.prototype.reply = function(data) {
		return res.write(JSON.stringify);
	};
	
	return ServerController;
})();

console.log("Launching server on :1235");

var server = new ServerController;
server.listen();

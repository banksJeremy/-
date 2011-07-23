###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Client
###

server_url = "http://localhost:1234/client_api/0.1/"

login ->
    login = prompt "Enter your login:"
    
    [username, password] = login.split /:/ 		#/Syntax highlighting
    
    loginRequest = $.ajax
        url: server_url
        dataType: "json"
        data: { username, password }
    
    loginRequest.then verify_auth

verify_auth = (data, textStatus, jqXHR) ->
	switch data.status
	   when "logged-in" then foo(bar)
	   when "not-logged-in" then   
		


auth_request = $.ajax
	url: url
    dataType: "json"

auth_request.then verify_auth


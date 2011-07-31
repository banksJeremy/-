###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Client
###

server_url = "http://localhost:1234/client_api/0.1/"

login = ->
	login = prompt "Enter your login:"
	
	[username, password] = login.split /:/ 		#/Syntax highlighting
	
	loginRequest = $.ajax
		url: server_url
		dataType: "json"
		data: { username, password }
	
	loginRequest.then verify_auth
	

verify_auth = (data, textStatus, jqXHR) ->
	switch data.status
		when "logged-in" then bootstrap()
		when "log-in" then login()
		when "invalid-login" then login()
		else
  			alert "Bad error!"
  			login()

bootstrap = ->
	body = $("body")
	
	body.append(h1 = $("<h1>").text("TraQk"))
	
	body.append(contents = $("<div>"))
	
	body.css
		margin: 0
		padding: 0
		background: "rgb(255, 252, 250)"
		fontFamily: "sans-serif"
		textAlign: "right"
	
	body.perlin
		gridSpacing: 1.413
		color: [16, 16, 0]
		opacity: .1
		tileable: yes
	
	h1.css
		background: "#222"
		color: "white"
		padding: ".125em .25em 0"
		margin: 0
		boxShadow: "0 0 .125em #222"
		textAlign: "left"
		textIndent: ".125em"
	
	$.makeBox = ->
		box = $("<div>")
		
		box.css
			textAlign: "left"
			display: "inline-block"
			height: "8em"
			width: "12em"
			background: "rgb(250, 255, 255)"
			fontSize: "1.5em"
			margin: ".4em"
			border: ".125em solid #111"
			padding: ".4em"
			borderRadius: "1em"
			borderTopRightRadius: "0"
			boxShadow: ".05em .05em .25em black"
			cursor: "pointer"
		
		box.hover (-> box.css borderColor: "#FA2"),
				  (-> box.css borderColor: "#111")
		
		box.click (-> box.hide "0.2")
		
		box.perlin
			gridSpacing: 2.1
			opacity: .05
			tileable: yes
		
		box.hide()
		contents.prepend box
		setTimeout (-> box.show "0.4"), 0
		return box
	
	$.makeBox().html "Hello, World!"

jQuery ->	 
	auth_request = $.ajax
		url: server_url
		dataType: "json"
	
	auth_request.then verify_auth

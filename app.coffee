###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks
###

jQuery ->
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
        borderBottom: ".125em solid black"
        color: "white"
        padding: ".125em .25em 0"
        margin: 0
        boxShadow: "0 0 .125em black"
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
            borderTopLeftRadius: "1em"
            boxShadow: ".05em .05em .5em black"
            cursor: "pointer"
        
        box.hover (-> box.css borderColor: "#FA2"), (-> box.css borderColor: "black")
        
        box.click ->
            box.hide "0.2"
        
        box.perlin
            gridSpacing: 2.1
            opacity: .05
            tileable: yes
        
        box.hide()
        contents.prepend box
        setTimeout (-> box.show "0.4"), 0
        return box
    
    
    $.makeBox().html "Hello, World!"
    
    $.openDB("data.db", data: ["time", "subject"]).then (db) ->
        $.makeBox().text "Database loaded."
        
        db.get().each (value) -> $.makeBox().text JSON.stringfy value

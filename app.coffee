###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks
###

log ?= (arguments...) -> console?.log?(arguments...)

### main activation when the database and DOM are ready ###

whenReady = (db, $) ->
    body = $("body")
    
    getAllData db, "data", (data) ->
        body.append $("<h2>").text("Current Data")
        body.append $("<pre>").text(JSON.stringify data)
    

getAllData = (db, objectStoreName, callback) ->
    transaction = db.transaction [objectStoreName]
    objectStore = transaction.objectStore objectStoreName
    
    allData = []
    
    objectStore.openCursor().onsuccess = ->
        cursor = event.target.result
        
        if cursor
            allData.push cursor.value
        else
            callback allData

withDBAndJQuery whenReady, "data.db",
                "0.0", (db) ->
                    try: db.deleteObjectStore "data"
                    data = db.createObjectStore "data", keyPath: "id", autoIncrement: yes
                    data.createIndex "time", "time"
                    data.createIndex "subject", "subject"

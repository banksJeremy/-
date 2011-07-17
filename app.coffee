###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks
###

log ?= (arguments...) -> console?.log?(arguments...)

### main activation when the database and DOM are ready ###

whenReady = (db, $) ->
    body = $("body")
    body.css fontFamily: "Georgia"
    
    log "Putting filler values into database."
    values = []
    values.push foo: "Bar",
                time: 99,
                age: 20,
                subject: 2,
    values.push time: 13,
                subject: "CN Tower"
    
    addValues db, "data", values, -> log "Filler values added."
    
    log "Displaying all values"
    getAllValues db, "data", (data) ->
        log "Got all values."
        body.append $("<h2>").text("Current Data")
        body.append $("<pre>").text(JSON.stringify data)

addValues = (db, objectStoreName, values, callback) ->
    transaction = db.transaction [objectStoreName], IDBTransaction.READ_WRITE
    objectStore = transaction.objectStore objectStoreName
    
    for value in values
        objectStore.add value
    
    transaction.onsuccess = callback
    transaction.onerror = (event) -> throw JSON.stringify event

getAllValues = (db, objectStoreName, callback) ->
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
                "0.1", (db) ->
                    data = db.createObjectStore "data", keyPath: "id", autoIncrement: yes
                    data.createIndex "time", "time"
                    data.createIndex "subject", "subject"

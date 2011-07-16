#!/usr/bin/env coffee --watch --compile
###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks
###
log = (arguments...) -> console?.log?(arguments...)

whenReady = (db, $) ->
    body = $("body")
    
    body.append $("<p>Hello, world!</p>")
    body.css "font": "14pt Georgia"
    
    log "Isn't this great?"
    
    transaction = db.transaction ["data"], IDBTransaction.READ_WRITE
    data = transaction.objectStore "data"
    
    data.put
        time: 0
        location: "toronto, on, ca"
        custom:
            x: 25
            color: "purple"
    
    data.put
        time: 20
        location: "chicago, il, us"
        custom:
            color: null
    
    transaction.onsuccess ->
        transaction = db.transaction ["data"], IDBTransaction.READ_WRITE
        data = transaction.objectStore "data"
        
        purpleRequest = data.get(0)
        purpleRequest.onsuccess = (event) ->
            alert "Got data: " + JSON.stringify event.target.result
        purpleRequest.onerror = (event) ->
            console.log event
            alert event

dbVersion = "71.0"

window.indexedDB = window.indexedDB or
                   window.webkitIndexedDB or
                   window.mozIndexedDB or
                   alert "Fatal Error: IndexedDB unavailable."

window.IDBTransaction = window.IDBTransaction or
                        window.webkitIDBTransaction or
                        window.mozIDBTransaction or
                        alert "Fatal Error: IDBTransaction unavailable."

dbRequest = indexedDB.open "traqk-personal.db"

dbRequest.onsuccess = (event) ->
    db = dbRequest.result
    
    onDBReady = ->
        jQuery ($) ->
            whenReady db, $
    
    if db.version != dbVersion
        versionRequest = db.setVersion dbVersion
        
        versionRequest.onsuccess = ->
            data = db.createObjectStore "data", keyPath: "id", autoIncrement: yes
            data.createIndex "time", "time"
            
            setTimeout onDBReady, 0
        
        versionRequest.onerror = ->
            alert "Fatal Error: Unable to reversion database (?)"
    else
        onDBReady()

dbRequest.onerror = (event) ->
    alert "Fatal Error: Unable to load database"

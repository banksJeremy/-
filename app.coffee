#!/usr/bin/env coffee --watch --compile
###
traqk - http://github.com/joeysilva/traqk
Copyright 2011 Joey Silva and Jeremy Banks
###

log = (arguments...) -> console?.log?(arguments...)

### main activation when the database and DOM are ready ###

whenReady = (db, $) ->
    body = $("body")
    
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
    
    transaction.oncomplete = ->
        transaction = db.transaction ["data"], IDBTransaction.READ
        data = transaction.objectStore "data"
        
        log "All events by time:"
        
        data.index("time").openCursor().onsuccess = ->
            cursor = event.target.result
            
            if cursor
                console.log cursor.value
                cursor.continue()
            else
                afterPrinting()
    
    afterPrinting = ->
        console.log "Done"

### remove vendor prefixes from IndexedDB API. ###

try
    unprefixName = (name, nameNotLeading) ->
        nameNotLeading ?= name
    
        window[name] = window[name] or
                       window["webkit" + nameNotLeading] or
                       window["moz" + nameNotLeading] or
                       window["o" + nameNotLeading] or
                       window["m" + nameNotLeading] or
                       (-> throw new Error "Fatal Error: #{name} is unavailable.")()
    
    unprefixName "indexedDB", "IndexedDB"
    
    for name of window
        match = /^[a-z]+(IDB.*)$/.exec name
        
        if match
            unsuffixedName = match[1]
            
            window[unsuffixedName] = window[name]

catch error
    alert error

### initialize database ###

dbVersion = String "0.0.1"
# the version should be updated whenever the object stores and/or indexes change.

dbRequest = indexedDB.open "traqk-personal.db"

dbRequest.onsuccess = (event) ->
    db = dbRequest.result
    
    onDBReady = ->
        log "DB ready, now waiting for DOM."
        jQuery ($) ->
            whenReady db, $
    
    if db.version is dbVersion
        setTimeout onDBReady, 0
    else
        log db.version, dbVersion
        log "Database version is #{db.version}, #{dbVersion} expected."
        
        versionRequest = db.setVersion dbVersion
        
        versionRequest.onsuccess = ->
            log "Configuring version #{dbVersion}."
            
            data = db.createObjectStore "data", keyPath: "id", autoIncrement: yes
            data.createIndex "time", "time"
            
            setTimeout onDBReady, 0
        
        versionRequest.onblocked = ->
            log "Database version correction blocked."

dbRequest.onerror = (event) ->
    alert "Fatal Error: Unable to load database"

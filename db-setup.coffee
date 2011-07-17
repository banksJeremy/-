### remove vendor prefixes from IndexedDB API. ###

log ?= (args...) -> console?.log?(args...)
jsonify ?= (args...) -> JSON.stringify args...

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
    
    ### withDBAndJQuery calls f when the DOM and a specified database are available ###
    
    window.withDB = (f, dbName = "database", dbVersion = -Infinity, dbVersionSetup = null) ->
        log "Attempting to open database #{jsonify dbName} version #{jsonify dbVersion}."
        
        dbRequest = indexedDB.open dbName
        db = null
        
        go = ->
            log "Database ready."
            f(db, $)
        
        dbRequest.onsuccess = (event) ->
            log "Database opened."
            db = dbRequest.result
            
            if db.version is dbVersion
                log "Database version is correct."
                setTimeout go, 0
            else
                log "Database version is currently #{jsonify db.version}. Requesting correction."
                
                versionRequest = db.setVersion dbVersion
                
                versionRequest.onsuccess = ->
                    log "Correcting database version."
                    dbVersionSetup?(db)
                    setTimeout go, 0
                
                versionRequest.onblocked = ->
                    throw new Error "Database version correction blocked."
        
        dbRequest.onerror = (event) ->
            throw new Error "Unable to open database."

catch error
    alert error
    throw error

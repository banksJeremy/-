### jquery.IndexedDB.coffee

My interface for http://www.w3.org/TR/2011/WD-IndexedDB-20110419/

$.openDB(name, objectStores, purge = no)
- Returns a $.Deferrred $.IndexedDB.
- The jQuery.IndexedDB will use the specified objectStores,
  provide a map of names to arrays of indexes.
- Set purge to erase everything in the database when
  opening it.

class $.IndexedDB (returned by $.openDB())
- All object stores are defiend as properties on this.

class $.IDBObjectStore (defined on $.IndexedDB().)
- .get(constraints) returns an $.IDBResult or throws an Error.
  
  .get where: location: "toronto,on,ca" 
  .get where: (time: ge: 0, lt: 10, ascending: yes)
  .get withFilter: f, withMap: g

class $.IDBResult (returned by $.IDBObjectStore methods)
- with @cursor,
- @filter and @map can be defined to modify values.
- .next() returns the $.Deferred next value 
- .toDeferredArray() returns an $.Deferred Array of all available results
- .each(f) asyncronousy calls f for each available result
  stopping if a non-undefined falsey value is returned.
###

class jQuery.IndexedDB
    constructor: (db, objectStores) ->
        for own name of objectStores
            this[name] = new jQuery.IDBObjectStore db, name

class jQuery.IDBObjectStore
    constructor: (@db, @name) ->
    
    get: (constraints) ->
        return new jQuery.IDBResult
    
class jQuery.IDBResult
    constructor: ->
    
    next: ->
        deferredResult = new jQuery.Deferred
        
        return deferredResult
    
    each: (f) ->
        yes

jQuery.openDB = (name, objectStores, purge = no) ->
    dbDeferred = new jQuery.Deferred
    
    dbRequest = indexedDB.open name
    
    dbRequest.onsuccess = (event) ->
        db = dbRequest.result
        
        if $.isArray objectStores
            objectStoresObject = {}
            objectStoresObject[key] = [] for key in objectStores
            objectStores = objectStoresObject
        
        objectStoresNames = []
        
        for own key, value of objectStores
            value.sort()
            objectStoresNames.push key
        
        objectStoresNames.sort()
        
        objectStoresJSON = "{" +
            (for own key, indexes of objectStores
                "#{JSON.stringify name}:#{JSON.stringify indexes}").join(",") +
            "}"
        
        dbObject = new $.IndexedDB db, objectStores
        
        if purge or db.version isnt objectStoresJSON
            versionRequest = db.setVersion objectStoresJSON
            
            versionRequest.onsuccess = (event) ->
                console.log "TODO: Initialize stuff.
                Each objectStore has an auto-incrementing ._id."
                
                if purge
                    for name in objectStoreNames
                        db.deleteObjectStore name
                
                for own name, indexes of objectStores
                    if name not in db.objectStoreNames
                        db.createObjectStore name, keyPath: "_id", autoIncrement: yes
                    
                    for index in indexes
                        db.createIndex name, index, unique: no
                
                setTimeout (-> dbRequest.resolve dbObject), 0
            
            versionRequest.onerror = (event) ->
                dbDeferred.reject "Error versioning database.", event
        
        setTimeout (-> dbRequest.resolve dbObject), 0
    
    dbRequest.onerror = (event) ->
        dbDeferred.reject "Error opening database.", event
    
    return dbDeferred.promise()

# remove vendor prefixes from IndexedDB identifiers:

window.indexedDB = window.indexedDB or
                   window.webkitIndexedDB or
                   window.mozIndexedDB or
                   window.oIndexedDB or
                   window.mIndexedDB or
                   (-> throw new Error "Fatal Error: IndexedDB is unavailable.")()

for name of window
    if match = /^[a-z]+(IDB.*)$/.exec name
        window[match[1]] = window[name]

(function() {
  /* jquery.IndexedDB.coffee
  
  My interface for http://www.w3.org/TR/2011/WD-IndexedDB-20110419/
  
  Copyright 2011 Jeremy Banks for traqk <http://traqk.me/>  
  Released under the MIT license.
  
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
    .get where: (time: ge: 0, lt: 10, ascending: yes), withFilter: f, withMap: g
  
  class $.IDBResult (returned by $.IDBObjectStore methods)
  - with @cursor,
  - @filter and @map can be defined to modify values.
  - .next() returns the $.Deferred next value 
  - .toDeferredArray() returns an $.Deferred Array of all available results
  - .each(f) asyncronousy calls f for each available result
    stopping if a non-undefined falsey value is returned.]
  */
  var match, name;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  jQuery.IndexedDB = (function() {
    function IndexedDB(db, objectStores) {
      var name;
      for (name in objectStores) {
        if (!__hasProp.call(objectStores, name)) continue;
        this[name] = new jQuery.IDBObjectStore(db, name);
      }
    }
    return IndexedDB;
  })();
  jQuery.IDBObjectStore = (function() {
    function IDBObjectStore(db, name) {
      this.db = db;
      this.name = name;
    }
    IDBObjectStore.prototype.get = function(constraints) {
      return new jQuery.IDBResult;
    };
    return IDBObjectStore;
  })();
  jQuery.IDBResult = (function() {
    function IDBResult() {}
    IDBResult.prototype.next = function() {
      var deferredResult;
      deferredResult = new jQuery.Deferred;
      return deferredResult;
    };
    IDBResult.prototype.each = function(f) {
      return true;
    };
    return IDBResult;
  })();
  jQuery.openDB = function(name, objectStores, purge) {
    var dbDeferred, dbRequest;
    if (purge == null) {
      purge = false;
    }
    dbDeferred = new jQuery.Deferred;
    dbRequest = indexedDB.open(name);
    dbRequest.onsuccess = function(event) {
      var db, dbObject, indexes, key, objectStoresJSON, objectStoresNames, objectStoresObject, value, versionRequest, _i, _len;
      db = dbRequest.result;
      if ($.isArray(objectStores)) {
        objectStoresObject = {};
        for (_i = 0, _len = objectStores.length; _i < _len; _i++) {
          key = objectStores[_i];
          objectStoresObject[key] = [];
        }
        objectStores = objectStoresObject;
      }
      objectStoresNames = [];
      for (key in objectStores) {
        if (!__hasProp.call(objectStores, key)) continue;
        value = objectStores[key];
        value.sort();
        objectStoresNames.push(key);
      }
      objectStoresNames.sort();
      objectStoresJSON = "{" + ((function() {
        var _results;
        _results = [];
        for (key in objectStores) {
          if (!__hasProp.call(objectStores, key)) continue;
          indexes = objectStores[key];
          _results.push("" + (JSON.stringify(name)) + ":" + (JSON.stringify(indexes)));
        }
        return _results;
      })()).join(",") + "}";
      dbObject = new $.IndexedDB(db, objectStores);
      if (purge || db.version !== objectStoresJSON) {
        versionRequest = db.setVersion(objectStoresJSON);
        versionRequest.onsuccess = function(event) {
          var index, indexes, name, _j, _k, _len2, _len3;
          console.log("TODO: Initialize stuff.                Each objectStore has an auto-incrementing ._id.");
          if (purge) {
            for (_j = 0, _len2 = objectStoreNames.length; _j < _len2; _j++) {
              name = objectStoreNames[_j];
              db.deleteObjectStore(name);
            }
          }
          for (name in objectStores) {
            if (!__hasProp.call(objectStores, name)) continue;
            indexes = objectStores[name];
            if (__indexOf.call(db.objectStoreNames, name) < 0) {
              db.createObjectStore(name, {
                keyPath: "_id",
                autoIncrement: true
              });
            }
            for (_k = 0, _len3 = indexes.length; _k < _len3; _k++) {
              index = indexes[_k];
              db.createIndex(name, index, {
                unique: false
              });
            }
          }
          return setTimeout((function() {
            return dbRequest.resolve(dbObject);
          }), 0);
        };
        versionRequest.onerror = function(event) {
          return dbDeferred.reject("Error versioning database.", event);
        };
      }
      return setTimeout((function() {
        return dbDeferred.resolve(dbObject);
      }), 0);
    };
    dbRequest.onerror = function(event) {
      return dbDeferred.reject("Error opening database.", event);
    };
    return dbDeferred.promise();
  };
  window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.mIndexedDB || (function() {
    throw new Error("Fatal Error: IndexedDB is unavailable.");
  })();
  for (name in window) {
    if (match = /^[a-z]+(IDB.*)$/.exec(name)) {
      window[match[1]] = window[name];
    }
  }
}).call(this);

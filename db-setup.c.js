(function() {
  /* remove vendor prefixes from IndexedDB API. */  var match, name, unprefixName, unsuffixedName;
  var __slice = Array.prototype.slice;
    if (typeof log !== "undefined" && log !== null) {
    log;
  } else {
    log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log.apply(console, args) : void 0 : void 0;
    };
  };
    if (typeof jsonify !== "undefined" && jsonify !== null) {
    jsonify;
  } else {
    jsonify = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return JSON.stringify.apply(JSON, args);
    };
  };
  try {
    unprefixName = function(name, nameNotLeading) {
            if (nameNotLeading != null) {
        nameNotLeading;
      } else {
        nameNotLeading = name;
      };
      return window[name] = window[name] || window["webkit" + nameNotLeading] || window["moz" + nameNotLeading] || window["o" + nameNotLeading] || window["m" + nameNotLeading] || (function() {
        throw new Error("Fatal Error: " + name + " is unavailable.");
      })();
    };
    unprefixName("indexedDB", "IndexedDB");
    for (name in window) {
      match = /^[a-z]+(IDB.*)$/.exec(name);
      if (match) {
        unsuffixedName = match[1];
        window[unsuffixedName] = window[name];
      }
    }
    /* withDBAndJQuery calls f when the DOM and a specified database are available */
    window.withDB = function(f, dbName, dbVersion, dbVersionSetup) {
      var db, dbRequest, go;
      if (dbName == null) {
        dbName = "database";
      }
      if (dbVersion == null) {
        dbVersion = -Infinity;
      }
      if (dbVersionSetup == null) {
        dbVersionSetup = null;
      }
      log("Attempting to open database " + (jsonify(dbName)) + " version " + (jsonify(dbVersion)) + ".");
      dbRequest = indexedDB.open(dbName);
      db = null;
      go = function() {
        log("Database ready.");
        return f(db, $);
      };
      dbRequest.onsuccess = function(event) {
        var versionRequest;
        log("Database opened.");
        db = dbRequest.result;
        if (db.version === dbVersion) {
          log("Database version is correct.");
          return setTimeout(go, 0);
        } else {
          log("Database version is currently " + (jsonify(db.version)) + ". Requesting correction.");
          versionRequest = db.setVersion(dbVersion);
          versionRequest.onsuccess = function() {
            log("Correcting database version.");
            if (typeof dbVersionSetup === "function") {
              dbVersionSetup(db);
            }
            return setTimeout(go, 0);
          };
          return versionRequest.onblocked = function() {
            throw new Error("Database version correction blocked.");
          };
        }
      };
      return dbRequest.onerror = function(event) {
        throw new Error("Unable to open database.");
      };
    };
  } catch (error) {
    alert(error);
    throw error;
  }
}).call(this);

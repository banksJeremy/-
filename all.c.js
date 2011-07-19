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

(function() {
  /*
  traqk - http://github.com/joeysilva/traqk
  Copyright 2011 Joey Silva and Jeremy Banks
  */  var addValues, getAllValues, whenReady;
  var __slice = Array.prototype.slice;
    if (typeof log !== "undefined" && log !== null) {
    log;
  } else {
    log = function() {
      var arguments, _ref;
      _ref = arguments, arguments = 1 <= _ref.length ? __slice.call(_ref, 0) : [];
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log.apply(console, arguments) : void 0 : void 0;
    };
  };
  /* main activation when the database and DOM are ready */
  whenReady = function(db) {
    var body, h1, values;
    body = $("body");
    body.css({
      font: "14pt Helvetica"
    });
    h1 = $("<h1>").html("<span>Tra<span>Q</span>k</span>");
    body.append(h1);
    log("Putting filler values into database.");
    values = [];
    values.push({
      foo: "Bar"
    }, {
      time: 99,
      age: 20,
      subject: 2
    });
    values.push({
      time: 13
    }, {
      subject: "CN Tower"
    });
    addValues(db, "data", values, function() {
      return log("Filler values added.");
    });
    log("Displaying all values");
    return getAllValues(db, "data", function(data) {
      log("Got all values.");
      body.append($("<h2>").text("Current Data"));
      return body.append($("<pre>").text(JSON.stringify(data)));
    });
  };
  addValues = function(db, objectStoreName, values, callback) {
    var objectStore, transaction, value, _i, _len;
    transaction = db.transaction([objectStoreName], IDBTransaction.READ_WRITE);
    objectStore = transaction.objectStore(objectStoreName);
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      objectStore.add(value);
    }
    transaction.onsuccess = callback;
    return transaction.onerror = function(event) {
      throw JSON.stringify(event);
    };
  };
  getAllValues = function(db, objectStoreName, callback) {
    var allData, objectStore, transaction;
    transaction = db.transaction([objectStoreName]);
    objectStore = transaction.objectStore(objectStoreName);
    allData = [];
    return objectStore.openCursor().onsuccess = function() {
      var cursor;
      cursor = event.target.result;
      if (cursor) {
        return allData.push(cursor.value);
      } else {
        return callback(allData);
      }
    };
  };
  withDB(whenReady, "data.db", "0.1", function(db) {
    var data;
    try {
      db.deleteObjectStore("data");
    } catch (_e) {}
    data = db.createObjectStore("data", {
      keyPath: "id",
      autoIncrement: true
    });
    data.createIndex("time", "time");
    return data.createIndex("subject", "subject");
  });
}).call(this);

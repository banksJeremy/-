/*
traqk - http://github.com/traqk/traqk
Copyright 2011 Joey Silva and Jeremy Banks

Client
*/

// remove vendor prefixes from IndexedDB identifiers:

window.indexedDB = window.indexedDB ||
                   window.webkitIndexedDB ||
                   window.mozIndexedDB ||
                   window.oIndexedDB ||
                   window.mIndexedDB ||
                   function() { throw new Error("Fatal Error: IndexedDB is              unavailable.");}()

for (var name in window) {
    if (var match = /^[a-z]+(IDB.*)$/.exec(name)) {
        window[match[1]] = window[name];
    }
}

$(function() {
    $("body").append(
        $("<div/>").append(
            $("<input/>").attr({
                type: "button",
                value: "Create Category",
                onclick: 'createCategory()'
            }),
            $("<input/>").attr({
                id: "category_name",
                type: "text"
            }),
            "<br/>"
        )
    );
});

function createCategory() {

    var category = $("#category_name").value;

}

db = null;

indexedDB.open = function() {
  var request = indexedDB.open("traqk");

  request.onsuccess = function(e) {
    db = e.target.result;
    // Do some more stuff in a minute
  };

  request.onfailure = function() { alert("Fuck"); };
};
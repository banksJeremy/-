(function(){var a,b,c,d,e=Array.prototype.slice;typeof log!="undefined"&&log!==null?log:log=function(){var a;a=1<=arguments.length?e.call(arguments,0):[];return typeof console!="undefined"&&console!==null?typeof console.log=="function"?console.log.apply(console,a):void 0:void 0},typeof jsonify!="undefined"&&jsonify!==null?jsonify:jsonify=function(){var a;a=1<=arguments.length?e.call(arguments,0):[];return JSON.stringify.apply(JSON,a)};try{c=function(a,b){b!=null?b:b=a;return window[a]=window[a]||window["webkit"+b]||window["moz"+b]||window["o"+b]||window["m"+b]||function(){throw new Error("Fatal Error: "+a+" is unavailable.")}()},c("indexedDB","IndexedDB");for(b in window)a=/^[a-z]+(IDB.*)$/.exec(b),a&&(d=a[1],window[d]=window[b]);window.withDB=function(a,b,c,d){var e,f,g;b==null&&(b="database"),c==null&&(c=-Infinity),d==null&&(d=null),log("Attempting to open database "+jsonify(b)+" version "+jsonify(c)+"."),f=indexedDB.open(b),e=null,g=function(){log("Database ready.");return a(e,$)},f.onsuccess=function(a){var b;log("Database opened."),e=f.result;if(e.version===c){log("Database version is correct.");return setTimeout(g,0)}log("Database version is currently "+jsonify(e.version)+". Requesting correction."),b=e.setVersion(c),b.onsuccess=function(){log("Correcting database version."),typeof d=="function"&&d(e);return setTimeout(g,0)};return b.onblocked=function(){throw new Error("Database version correction blocked.")}};return f.onerror=function(a){throw new Error("Unable to open database.")}}}catch(f){alert(f);throw f}}).call(this)
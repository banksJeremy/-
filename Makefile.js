#!/usr/bin/env node
var fs       = require("fs"),
    UglifyJS = require("./build_tools/UglifyJS-1.0.6/uglify-js.js"),
    Coffee   = require("./build_tools/CoffeeScript-1.1.1/lib/coffee-script.js");

var minify = function(code) {
    var ast = UglifyJS.parser.parse(code);
    var mangledAst = UglifyJS.uglify.ast_mangle(ast);
    var optimizedAst = UglifyJS.uglify.ast_squeeze(mangledAst);
    return UglifyJS.uglify.gen_code(optimizedAst);
}

var log = function() {
    console.log.apply(console, arguments);
}

log("Loading all CoffeeScript files...");

var filenames = fs.readdirSync(".")
                  .filter(function(name) {
                      return /\.coffee$/.test(name); });
filenames.sort();

var coffeeCode = [];

for(var i = 0; i < filenames.length; i++) {
    log("- reading " + filenames[i]);
    var asCoffee = fs.readFileSync(filenames[i], "utf8");
    coffeeCode.push(asCoffee);
}

log("Compiling all CoffeeScript files...");

var jsCode = [];

for (var i = 0; i < filenames.length; i++) {
    log("- compiling " + filenames[i]);
    var asJs = Coffee.compile(coffeeCode[i]);
    jsCode.push(asJs);
    
    var filename = filenames[i].replace(/coffee$/, "c.js");
    log("- writing " + filename);
    fs.writeFileSync(filename, asJs, "utf8");
}

/*

filenames.push("all.coffee");
jsCode.push(jsCode.join("\n"));

log("Producing minified versions...")

var miniCode = [];

for (var i = 0; i < filenames.length; i++) {
    var asMini = minify(jsCode[i]);
    miniCode.push(asMini);
    
    var filename = filenames[i].replace(/coffee$/, "m.js");
    log("- writing " + filename)
    fs.writeFileSync(filename, asMini, "utf8");
}

*/
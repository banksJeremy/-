#!/usr/bin/env python
from subprocess import *
from glob import glob
from sys import exit, argv

first_files = "db-setup.coffee", "app.coffee"
# all files will be compiled, but the ones listed here
# will be compiled first and included first in all.c.js.

if call(["coffee", "--version"], stdout=PIPE) != 0:
    print "CoffeeScript missing!"
    exit (1)

def filename_sort_key(filename):
    if filename in first_files:
        return 0, first_files.index(filename)
    else:
        return 1, filename

coffee_files = sorted(glob("*.coffee"), key=filename_sort_key)
output_files = [name.rpartition("coffee")[0] + "c.js" for name in coffee_files]

jss = []

for coffee_file, output_file in zip(coffee_files, output_files):
    print "Compiling", coffee_file
    
    js = check_output(["coffee", "--compile", "--print", coffee_file])
    jss.append(js)
    
    print "Writing", output_file
    
    with open(output_file, "wt") as f:
        f.write(js)

with open("all.c.js", "wt") as f:
    f.write("\n".join(jss))

del jss

mini_files = [name.rpartition("c.js")[0] + "cm.js" for name in output_files]

for output_file, mini_file in zip(output_files, mini_files):
    print "Minifying", output_file
    
    minified = check_output(["uglifyjs", output_file])
    
    print "Writing minified", mini_file
    
    with open(mini_file, "wt") as f:
        f.write(minified)

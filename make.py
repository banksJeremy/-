#!/usr/bin/env python
from subprocess import *
from glob import glob
from sys import exit

print "(coffee and uglifyjs required)"

coffee_files = glob("*.coffee")
output_files = [name.rpartition(".coffee")[0] + ".c.js" for name in coffee_files]

for coffee_file, output_file in zip(coffee_files, output_files):
    print "Compiling", coffee_file
    
    js = check_output(["coffee", "--compile", "--print", coffee_file])
    
    print "Writing", output_file
    
    with open(output_file, "wt") as f:
        f.write(js)

for output_file in output_files:
    print "Minifying", output_file
    
    minified = check_output(["uglifyjs", output_file])
    
    print "Writing minified", output_file
    
    with open(output_file, "wt") as f:
        f.write(minified)
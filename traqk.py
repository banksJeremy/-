#!/usr/bin/env python2.7
from bottle import route, run
import sqlite3

db = sqlite3.connect("database.db")
db.execute("""CREATE TABLE IF NOT EXISTS
              "example" (key TEXT PRIMARY KEY, value TEXT)""")

with db:
    db.execute("""INSERT INTO example VALUES ("hello", "world")""")
    db.execute("""INSERT INTO example VALUES ("world", "hello")""")

@route("/hello")
def hello():
    return "Hello World!"

run(host="localhost", port=8080)

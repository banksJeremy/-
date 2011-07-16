#!/usr/bin/env python2.7
import bottle
import sqlite3
import time

bottle.debug(True)

db = sqlite3.connect("database.db")

with db:
    db.execute("""
        CREATE TABLE IF NOT EXISTS
        "hits" (timestamp INT)
    """)

@bottle.route("/")
def index():
    bottle.response.content_type = "text/plain"
    
    with db:
        db.execute("INSERT INTO hits (timestamp) VALUES (?)",
                   [time.time()])
    
    for row in db.execute("SELECT timestamp FROM HITS"):
        timestamp, = row
        
        yield "Hit at " + str(timestamp) + "\n"

import webbrowser
webbrowser.open("http://localhost:8080/")
bottle.run(host="localhost", port=8080)

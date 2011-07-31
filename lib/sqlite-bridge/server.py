#!/usr/bin/env python3.2
import codecs
import sqlite3
import sys
import json
import threading
import queue

class SQLiteServer(object):
    QUEUE_SIZE = 16
    
    def __init__(self, in_stream, out_stream):
        self.in_stream = in_stream
        self.out_stream = out_stream
        self.working = False
        self.in_queue = queue.Queue(maxsize=self.QUEUE_SIZE)
        self.out_queue = queue.Queue(maxsize=self.QUEUE_SIZE)
    
    def start(self, daemon=True):
        self.worker_thread = threading.Thread(target=self.do_work)
        self.input_thread = threading.Thread(target=self.do_input)
        self.output_thread = threading.Thread(target=self.do_output)
        
        self.worker_thread.daemon = daemon
        self.input_thread.daemon = False
        self.output_thread.daemon = False
        
        self.working = True
        
        self.worker_thread.start()
        self.input_thread.start()
        self.output_thread.start()
    
    def do_work(self):
        while self.working:
            self.out_queue.put(self._do_work(self.in_queue.get()))
    
    def _do_work(self, work):
    	return {"input": work}
    
    def do_input(self):
        while True:
            # self.in_queue.put(json.load(self.in_stream))
            self.in_queue.put(json.loads(self.in_stream.readline()))
    
    def do_output(self):
        while True:
            json.dump(self.out_queue.get(), self.out_stream)
            self.out_stream.flush()

def quote_identifier(s, errors="strict"):
    """Quotes a SQLite identifier."""
    # from http://stackoverflow.com/q/6701665/1114
    
    encodable = s.encode("utf-8", errors).decode("utf-8")

    nul_index = encodable.find("\x00")

    if nul_index >= 0:
        error = UnicodeEncodeError("NUL-terminated utf-8", encodable,
                                   nul_index, nul_index + 1, "NUL not allowed")
        error_handler = codecs.lookup_error(errors)
        replacement, _ = error_handler(error)
        encodable = encodable.replace("\x00", replacement)

    return "\"" + encodable.replace("\"", "\"\"") + "\""

def main(in_=sys.stdin, out=sys.stdout):
    SQLiteServer(in_, out).start(daemon=True)

if __name__ == "__main__":
    main()

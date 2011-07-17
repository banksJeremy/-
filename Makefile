server:
	(sleep 1; python -m webbrowser http://localhost:8000/index.html) &
	python -m SimpleHTTPServer

coffee-daemon:
	coffee --watch --compile . &

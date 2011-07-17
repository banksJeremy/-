server:
	(sleep 1; python -m webbrowser http://localhost:8000/index.html) &
	python -m SimpleHTTPServer &> /dev/null &
	coffee --watch --compile .

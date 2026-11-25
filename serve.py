"""Serve the repo root on http://localhost:8765/ and open it in the browser.

Same server as `python3 -m http.server 8765`, run from the repo root so the docs site
can load tokens/ from outside site/.
"""
import functools
import http.server
import os
import threading
import webbrowser

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
URL = f"http://localhost:{PORT}/"


def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    server = http.server.ThreadingHTTPServer(("", PORT), handler)
    threading.Timer(0.5, webbrowser.open, args=(URL,)).start()
    print(f"Serving {ROOT} at {URL} (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == "__main__":
    main()

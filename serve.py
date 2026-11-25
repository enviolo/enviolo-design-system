"""Serve the repo root on http://localhost:8765/ and open it in the browser (--no-open to skip).

Same server as `python3 -m http.server 8765`, run from the repo root so the docs site
can load tokens/ from outside site/.
"""
import functools
import http.server
import os
import sys
import threading
import webbrowser

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
URL = f"http://localhost:{PORT}/"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Never let the browser cache: edited CSS and JS show up on a plain reload."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    open_browser = "--no-open" not in sys.argv
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    try:
        server = Server(("", PORT), handler)
    except OSError:
        print(f"Port {PORT} is already in use: the docs are probably already served at {URL}")
        if open_browser:
            webbrowser.open(URL)
        return
    if open_browser:
        threading.Timer(0.5, webbrowser.open, args=(URL,)).start()
    print(f"Serving {ROOT} at {URL} (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == "__main__":
    main()

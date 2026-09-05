"""Local review server for src/.

Plain `python -m http.server` lets Chrome cache the persona scripts, and a
cache-buster on index.html does not reach the <script src> tags it loads - so
an edit to a persona file can silently not be running while the page looks
fine. That cost real debugging time. This sends no-store on everything.

    python tools/serve.py [port]        # default 8899
"""
import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src')


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        SimpleHTTPRequestHandler.end_headers(self)

    def log_message(self, fmt, *args):
        pass    # the request log is noise during review


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    handler = functools.partial(NoCacheHandler, directory=os.path.abspath(ROOT))
    server = ThreadingHTTPServer(('127.0.0.1', port), handler)
    print('serving %s at http://localhost:%d/  (no-store)' % (os.path.abspath(ROOT), port))
    server.serve_forever()


if __name__ == '__main__':
    main()

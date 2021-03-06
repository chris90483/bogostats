import re
from sys import exc_info
from traceback import format_tb
import json

item_list = ["blue_background"]

def index_temp(environ, start_response):
    """This function will be mounted on "/" and display a link
    to the hello world page."""
    start_response('200 OK', [('Content-Type', 'text/html')])
    return ['''Hello World Application
               This is the Hello World application:

`continue <hello/>`_

''']

def js(environ, start_response):
    """Like the example above, but it uses the name specified in the
URL."""
    # get the name from the url if it was specified there.
    args = environ['myapp.url_args']
    start_response('200 OK', [('Content-Type', 'text/html')])
    with open('main.js', 'r') as content_file:
        content = content_file.read()
    return [content]

def favicon(environ, start_response):
    """Like the example above, but it uses the name specified in the
URL."""
    # get the name from the url if it was specified there.
    args = environ['myapp.url_args']
    start_response('200 OK', [('Content-Type', 'image/x-icon')])
    with open('static/favicon.png', 'r') as content_file:
        content = content_file.read()
    return [content]

def index(environ, start_response):
    """Like the example above, but it uses the name specified in the
URL."""
    # get the name from the url if it was specified there.
    args = environ['myapp.url_args']
    start_response('200 OK', [('Content-Type', 'text/html')])
    with open('home.html', 'r') as content_file:
        content = content_file.read()
    return [content]


def give_item(environ, start_response):
    args_str = environ['QUERY_STRING']
    start_response('200 OK', [('Content-Type', 'application/json')])
    args = args_str.split('=')
    response = {}

    if args[0] == "item":
        item = args[1]
        if item in item_list:
            response["success"] = True
            # TODO add stuffs for checking if enough money etc.,
            return [json.dumps(response).encode("utf-8")]
    response["success"] = False
    return [json.dumps(response).encode("utf-8")]



def not_found(environ, start_response):
    """Called if no URL matches."""
    start_response('404 NOT FOUND', [('Content-Type', 'text/plain')])
    return ['Not Found']

# map urls to functions
urls = [
    (r'^$', index),
    (r'main.js/?$', js),
    (r'buy', give_item),
    (r'favicon.ico', favicon)
]

def application(environ, start_response):
    """
    The main WSGI application. Dispatch the current request to
    the functions from above and store the regular expression
    captures in the WSGI environment as  `myapp.url_args` so that
    the functions from above can access the url placeholders.

    If nothing matches call the `not_found` function.
    """
    path = environ.get('PATH_INFO', '').lstrip('/')
    for regex, callback in urls:
        match = re.search(regex, path)
        if match is not None:
            environ['myapp.url_args'] = match.groups()
            return callback(environ, start_response)
    return not_found(environ, start_response)


class ExceptionMiddleware(object):
    """The middleware we use."""

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        """Call the application can catch exceptions."""
        appiter = None
        # just call the application and send the output back
        # unchanged but catch exceptions
        try:
            appiter = self.app(environ, start_response)
            for item in appiter:
                yield item
        # if an exception occours we get the exception information
        # and prepare a traceback we can render
        except:
            e_type, e_value, tb = exc_info()
            traceback = ['Traceback (most recent call last):']
            traceback += format_tb(tb)
            traceback.append('%s: %s' % (e_type.__name__, e_value))
            # we might have not a stated response by now. try
            # to start one with the status code 500 or ignore an
            # raised exception if the application already started one.
            try:
                start_response('500 INTERNAL SERVER ERROR', [
                               ('Content-Type', 'text/plain')])
            except:
                pass
            yield '\n'.join(traceback)

        # wsgi applications might have a close function. If it exists
        # it *must* be called.
        if hasattr(appiter, 'close'):
            appiter.close()

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    srv = make_server('localhost', 8080, application)
    srv.serve_forever()
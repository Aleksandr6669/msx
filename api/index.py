from app import app

# Vercel serverless function entrypoint
# Exposes the WSGI Flask application object
wsgi_app = app

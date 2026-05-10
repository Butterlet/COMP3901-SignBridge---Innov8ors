from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os

# load .env
load_dotenv()

# Create extension objects
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'yoursecretkey')
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True') == 'True'
    CORS(app, supports_credentials=True, origins=[os.getenv('FRONTEND_ORIGIN', 'http://localhost:3000')])

    # Bind extensions to app
    bcrypt.init_app(app)

    # Import routes AFTER extensions are initialized
    from routes import auth
    app.register_blueprint(auth)

    # Ensure CORS headers are present even on error responses
    @app.after_request
    def add_cors_headers(response):
        origin = os.getenv('FRONTEND_ORIGIN', 'http://localhost:3000')
        response.headers.setdefault('Access-Control-Allow-Origin', origin)
        response.headers.setdefault('Access-Control-Allow-Credentials', 'true')
        response.headers.setdefault('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.setdefault('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response

    return app
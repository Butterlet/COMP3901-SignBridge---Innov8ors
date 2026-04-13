from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS

# Create extension objects
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'yoursecretkey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['DEBUG'] = True
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Bind extensions to app
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Import routes AFTER extensions are initialized
    from .routes import auth
    app.register_blueprint(auth)

     # Tell Flask-Login how to load a user from the database
    from .models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app

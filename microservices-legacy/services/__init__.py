import os
from flask import Flask
from flask_oauthlib.client import OAuth
from flask_login import LoginManager
from flask_session import Session
from flask import current_app
from .utils import firestore
import json
from flask import current_app, render_template, Flask, redirect, request, url_for, session
import requests
from flask_login import login_required, logout_user, current_user, login_user
from .models import User


login_manager = LoginManager()

sess = Session()
login_manager.login_view = 'login'

def create_app(config):
    # create and configure the app
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=config.SECRET_KEY,
        MAX_CONTENT_LENGTH=8 * 1024 * 1024,
        ALLOWED_EXTENSIONS=set(['png', 'jpg', 'jpeg', 'gif']),
    )

    app.config['GOOGLE_ID'] = config.GOOGLE_OAUTH2_CLIENT_ID
    app.config['GOOGLE_SECRET'] = config.GOOGLE_OAUTH2_CLIENT_SECRET
    app.debug = False
    app.config['SESSION_TYPE'] = 'filesystem'

    login_manager.init_app(app)
    sess.init_app(app)
    oauth = OAuth(app)
    google = oauth.remote_app(
        'google',
        consumer_key=app.config.get('GOOGLE_ID'),
        consumer_secret=app.config.get('GOOGLE_SECRET'),
        request_token_params={
            'scope': 'email'
        },
        base_url='https://www.googleapis.com/oauth2/v1/',
        request_token_url=None,
        access_token_method='POST',
        access_token_url='https://accounts.google.com/o/oauth2/token',
        authorize_url='https://accounts.google.com/o/oauth2/auth',
    )

    from . import routes

    app.register_blueprint(routes.bp)

    @app.route('/')
    def index():
        print(current_user.is_authenticated)
        if current_user.is_authenticated:
            return redirect(url_for('routes.list_products'))
        return render_template("login.html")

    @app.route('/login')
    def login():
        return google.authorize(callback=url_for('.authorized', _external=True))


    @app.route('/login/authorized')
    def authorized():
        resp = google.authorized_response()
        if resp is None:
            return redirect(url_for('services.index'))

        session['google_token'] = (resp['access_token'], '')
        access_token = resp['access_token']
        authorization_header = {"Authorization": "OAuth %s" % access_token}
        user = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", 
                       headers=authorization_header)
        user_data = json.loads(user.text)
        user = firestore.create_user(user_data, user_data.get("email"))
        if user:
            user_obj = User(user.get("id"), user.get("email"), user.get("is_admin", False))
            login_user(user_obj)
        return redirect(url_for('routes.list_products'))

    return app

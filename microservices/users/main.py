from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import firestore
from functools import wraps
import requests
import jwt
import config

app = Flask(__name__)
# enable CORS
cors = CORS(app)

app.config.from_mapping(
    SECRET_KEY=config.SECRET_KEY,
    MAX_CONTENT_LENGTH=8 * 1024 * 1024,
    ALLOWED_EXTENSIONS=set(['png', 'jpg', 'jpeg', 'gif']),
    CORS_HEADERS= 'Content-Type'
)

app.debug = False


def document_to_dict(doc):
    if not doc.exists:
        return None
    doc_dict = doc.to_dict()
    doc_dict['id'] = doc.id
    return doc_dict


def get_or_create_user(data, user_id=None):
    db = firestore.Client()
    user_ref = db.collection(u'User').document(user_id)
    if not user_ref.get().exists:
        user_ref.set(data)
    return document_to_dict(user_ref.get())

def update_user(data, user_id):
    db = firestore.Client()
    user_ref = db.collection(u'User').document(user_id)
    user_ref.update(data)
    return document_to_dict(user_ref.get())

def decode_jwt_token(auth_token):
    try:
        payload = jwt.decode(auth_token)
        return payload['sub']
    except jwt.exceptions.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.exceptions.InvalidTokenError:
        return 'Invalid token. Please log in again.'

def authenticate(func):
    @wraps
    def decorator(*args, **kwargs):
        code = 401
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            response_object['message'] = 'Provide a valid auth token.'
            code = 403
            return jsonify(response_object), code
        auth_token = auth_header.split(" ")[1]
        return func(response)
    return decorator

@app.route('/login', methods=['POST'])
def login():
    access_token = request.headers.get('access-token')
    if not access_token:
        response_object = {
            'status': 'error',
            'message': 'Provide a valid access token obtained from google oauth login'
        }
        return jsonify(response_object), 403
    authorization_header = {"Authorization": "OAuth %s" % access_token}
    user = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers=authorization_header)
    user_data = user.json()
    user = get_or_create_user(user_data, user_data.get("email"))
    return jsonify(user=user,)





if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

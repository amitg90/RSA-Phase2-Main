from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from google.cloud import firestore
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

def document_to_dict(doc):
    if not doc.exists:
        return None
    doc_dict = doc.to_dict()
    doc_dict['id'] = doc.id
    return doc_dict


def get_products_list():
    db = firestore.Client()
    query = db.collection(u'Product').where(u"qoh", u">", 0).order_by(u'qoh')
    query = query.order_by(u'unitprice')

    docs = query.stream()
    docs = list(map(document_to_dict, docs))
    
    last_prodcut_id = docs[-1][u'id']
    return docs, last_prodcut_id

@app.route("/catalog",  methods=['GET'])
def list_items():
    data = request.get_json()
    products, last_prodcut_id = get_products_list()
    return jsonify(products=products, last_prodcut_id=last_prodcut_id)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8081, debug=True)

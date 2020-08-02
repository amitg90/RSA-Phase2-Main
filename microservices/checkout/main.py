from flask import Flask, jsonify, request, json
from flask_cors import CORS, cross_origin
from google.cloud import firestore
import email_helper
import datetime
import config

app = Flask(__name__)
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


def add_cart(email, data):
    db = firestore.Client()
    # get handler for default cart for this user
    query = db.collection(u'Cart').document(email)
    if not query.get().exists:
        query.set(data)
        return document_to_dict(query.get())
    # update
    query.update(data)
    return document_to_dict(query.get())

def delete_cart_product(cart_id, product_id):
    db = firestore.Client()

    # get handler for default cart for this user
    query = db.collection(u'Cart').document(cart_id)

    if not query.get().exists:
        return False

    query.update({
        product_id: firestore.DELETE_FIELD
    })

    return True

def update_inventory(cart_id, product_dict):
    inventory_updated = {}
    db = firestore.Client()
    for product_id in product_dict.keys():
        print(product_id)
        item_ref = db.collection(u'Product').document(product_id)
        item = document_to_dict(item_ref.get())
        quantity = max(0, int(item.get("qoh")) - int(product_dict[product_id]["quantity"]))
        if quantity < 0:
            continue
        item_ref.update({"qoh": quantity})
        delete_cart_product(cart_id, product_id)
        inventory_updated.update({product_id: product_dict[product_id]})
    return inventory_updated

def update_user(data, user_id):
    db = firestore.Client()
    user_ref = db.collection(u'User').document(user_id)
    user_ref.update(data)
    return document_to_dict(user_ref.get())

def create_order(data, order_id=None):
    db = firestore.Client()
    order_ref = db.collection(u'Order').document(order_id)
    order_ref.set(data)
    return document_to_dict(order_ref.get())

def get_cart_list(cart_id):
    db = firestore.Client()
    query = db.collection(u'Cart').document(cart_id)
    if query is None:
        return None, 0
    snapshot = query.get()
    data = snapshot.to_dict()
    return data

def read_product(item_id):
    db = firestore.Client()
    item_ref = db.collection(u'Product').document(item_id)
    snapshot = item_ref.get()
    return document_to_dict(snapshot)

def delete_cart(cart_id, product_dict):
    for product_id in product_dict:
        delete_cart_product(cart_id, product_id)

@app.route("/cart/checkout", methods=['POST'])
@cross_origin()
def checkout_product():
    response_object = {
            'status': 'error',
            'message': 'Order is not successful'
        }
    # Get user_id and cart_id
    user_id = request.headers.get('user-id')
    cart_id = request.headers.get('cart-id')
    print(user_id, cart_id)

    # if no cart ID / user_id return error
    if cart_id is None or user_id is None:
        response_object["message"] = "Please send valid cart_id, user_id"
        return jsonify(response_object), 403

    data = request.get_json()
    if not data:
        response_object["message"] = "Please send valid shipping details to place order"
        return jsonify(response_object), 403
    
    try:
        shipping_data = data.get("userdata")
        user_data = {
                "fullname": shipping_data.get("fullname"),
                "email": shipping_data.get("email"),
                "address1": shipping_data.get("address1"),
                "address2": shipping_data.get("address2"),
                "city": shipping_data.get("city"),
                "state": shipping_data.get("state"),
                "country": shipping_data.get("country"),
                "zip_code": shipping_data.get("zip_code"),
                "phone_number": shipping_data.get("phone_number")
            }
        user = update_user(user_data, user_id)
    except Exception as error:
        response_object["message"] = error
        return jsonify(response_object), 403
    
    product_dict = get_cart_list(cart_id)
    order_avalability = update_inventory(cart_id, product_dict)
    if order_avalability:
        order_data = {
            "products": order_avalability,
            "user_id": user_id,
            "created_at": datetime.datetime.now(),
        }
        order = create_order(order_data)
        products = [read_product(product_id) for product_id in order_avalability.keys()]
        email_helper.send_order_confirmation(user_id, products, user, order)

        #order is successful, clear cart id
        delete_cart(cart_id, product_dict)
        print(order)
        return jsonify(order=order), 200
    return jsonify(response_object), 403


@app.route('/cart/list', methods=['POST'])
@cross_origin()
def cart_list_products():
    response_object = {
        'status': 'error',
        'message': 'not able to find the cart'
    }

    # Get user_id and cart_id
    cart_id = request.headers.get('cart-id')

    print(cart_id)

    # if no user_id return error
    if cart_id is None:
        response_object["message"] = "Please send valid cart_id"
        return jsonify(response_object), 403

    try:
        # create product in DB cart
        cart = get_cart_list(cart_id)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Invalid data:{}".format(e)
        }), 403

    return jsonify(cart=cart), 200

@app.route('/cart/add', methods=['POST'])
@cross_origin()
def cart_add_product():
    response_object = {
        'status': 'error',
        'message': 'Order is not successful'
    }

    # Get user_id and cart_id
    user_id = request.headers.get('user-id')
    cart_id = request.headers.get('cart-id')

    print(request.headers)

    # if no cart ID / user_id return error
    if cart_id is None or user_id is None:
        response_object["message"] = "Please send valid cart_id, user_id"
        return jsonify(response_object), 403

    # Get the data to be updated
    data = request.get_data()
    data = json.loads(data.decode("utf-8"))
    try:
        products = data.get("products")
        # create product in DB cart
        cart = add_cart(cart_id, products)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Invalid data:{}".format(e)
        }), 403

    return jsonify(cart=cart), 200


@app.route("/cart/delete", methods=['POST'])
@cross_origin()
def cart_delete_product():
    response_object = {
        'status': 'error',
        'message': 'Order is not successful'
    }

    # Get user_id and cart_id
    user_id = request.headers.get('user-id')
    cart_id = request.headers.get('cart-id')

    # if no cart ID / user_id return error
    if cart_id is None or user_id is None:
        response_object["message"] = "Please send valid cart_id, user_id"
        return jsonify(response_object), 403

    # Get the data to be updated
    data = request.get_data()
    data = json.loads(data.decode("utf-8"))
    try:
        product_id = data.get("product_id")
        is_deleted = delete_cart_product(cart_id, product_id)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Invalid data:{}".format(e)
        }), 403
    # delete product in DB cart
    return jsonify(deleted=is_deleted), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8082, debug=True)
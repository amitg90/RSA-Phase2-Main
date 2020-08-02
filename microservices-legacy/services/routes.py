import json
import requests
import datetime
from flask import current_app, render_template, Flask, redirect, request, url_for, session
from .utils import firestore
from .utils import storage
from .utils import email_helper
from google.cloud import error_reporting
from flask import Blueprint
from flask_login import login_required, logout_user, current_user, login_user
from services import login_manager
from .models import User


bp = Blueprint("routes", __name__, url_prefix="/")


@login_manager.user_loader
def user_loader(user_id):
    """Given *user_id*, return the associated User object.

    :param unicode user_id: user_id (email) user to retrieve

    """
    user = firestore.read_user(user_id)

    return User(user.get("id"), user.get("email"), user.get("is_admin", False))


@bp.route('/logout')
@login_required
def logout():
    session.pop('google_token', None)
    logout_user()
    return redirect(url_for('index'))
 

@bp.route("/product/add", methods=['GET', 'POST'])
@login_required
def add_product():
    if request.method == 'POST':
        data = request.form.to_dict(flat=True)
        data["unitprice"] = '{:,.2f}'.format(float(data.get("unitprice", 100000)))
        data["qoh"] = int(data.get("qoh", 0))
        # If an image was uploaded, update the data to point to the
        image_urls = storage.upload_image_files(request.files.getlist('link_to_images'))
        if image_urls:
            data['link_to_images'] = image_urls
        product = firestore.create(data)
        return redirect(url_for('routes.product_detail', product_id=product['id']))

    return render_template("product_entry_form.html", action='Add', product={})


@bp.route("/confirm")
@login_required
def confirm():
    product = firestore.read(request.args.get("product_id"))
    user = firestore.read_user(request.args.get("user_id"))
    order = firestore.read_order(request.args.get("order_id"))
    return render_template("confirm.html", product=product, user=user, order=order)

@bp.route("/checkout/<product_id>", methods=['POST'])
@login_required
def checkout_product(product_id):
    product = firestore.read(product_id)
    data = request.form.to_dict(flat=True)
    units = int(data.get("units", "1"))
    user = firestore.read_user(current_user.id) if current_user.is_authenticated else None
    total_price = '{:,.2f}'.format(float(product.get("unitprice", "0")) * units)
    error_message = None
    if data.get("email") is not None:
        email = data.get("email")
        order_success = firestore.update_inventory(product_id, units)
        if order_success:
            error_message=None
            
            user_data = {
                "fullname": data.get("fullname"),
                "email": data.get("email"),
                "address1": data.get("address1"),
                "address2": data.get("address2"),
                "city": data.get("city"),
                "state": data.get("state"),
                "country": data.get("country"),
                "zip_code": data.get("zip_code"),
                "phone_number": data.get("phone_number")
            }
            user = firestore.update_user(user_data, email)
            order_data = {
                "product_id": product.get("id"),
                "user_id": user.get("id"),
                "units": int(data.get("units")),
                "created_at": datetime.datetime.now(),
                "total_price": total_price
            }
            order = firestore.create_order(order_data)
            order["created_at"] = order["created_at"].strftime("%b %d %Y %H:%M")
            email_helper.send_order_confirmation(email, product, user, order)
            return redirect(url_for("routes.confirm", product_id=product.get("id"), user_id=user.get("id"), order_id=order.get("id")))
        else:
            error_message = "can not place the order, try a different item", 
    return render_template("checkout.html", product=product, user=user, units=units, total_price=total_price, error=error_message)

@bp.route("/product/detail/<product_id>")
@login_required
def product_detail(product_id):
    product = firestore.read(product_id)
    return render_template('product_details.html', product=product)


@bp.route("/orders")
@login_required
def list_orders():
    orders = firestore.list_collection(u'Order')
    return render_template("order_list.html", orders=orders)


@bp.route("/users")
@login_required
def list_users():
    users = firestore.list_collection(u'User')
    return render_template("user_list.html", users=users)


@bp.route("/home")
@login_required
def list_products():
    start_after = request.args.get('start_after', None)
    products, last_product_id = firestore.next_page(start_after=start_after)
    return render_template("product_list.html", products=products, last_product_id=last_product_id)

# Add an error handler that reports exceptions to Stackdriver Error
# Reporting. Note that this error handler is only used when debug
# is False
@bp.errorhandler(500)
def server_error(e):
    client = error_reporting.Client()
    client.report_exception(
        http_context=error_reporting.build_flask_context(request))
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500
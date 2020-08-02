import os
from flask import render_template
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import config

def send_order_confirmation(email, product, user, order):
    html_content=render_template("email.html", product=product, order=order, user=user)
    try:
        message = Mail(from_email=config.SENDGRID_SENDER_EMAIL, to_emails=email, subject='Order confirmation from ML Academy store', html_content=html_content)
        sg = SendGridAPIClient(api_key=config.SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return True
    except Exception as e:
        print(e)
        return False
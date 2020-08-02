"""
This file contains all of the configuration values for the application.
Update this file with the values for your specific Google Cloud project.
You can create and manage projects at https://console.developers.google.com
"""

import os

# The secret key is used by Flask to encrypt session cookies.
SECRET_KEY = os.environ.get('SECRET_KEY')

# There are three different ways to store the data in the application.
# You can choose 'datastore', 'cloudsql', or 'mongodb'. Be sure to
# configure the respective settings for the one you choose below.
# You do not have to configure the other data backends. If unsure, choose
# 'datastore' as it does not require any additional configuration.
DATA_BACKEND = 'datastore'

# Google Cloud Project ID. This can be found on the 'Overview' page at
# https://console.developers.google.com
GOOGLE_PROJECT_ID = os.environ.get('GOOGLE_PROJECT_ID')

# Google Cloud Storage and upload settings.
# Typically, you'll name your bucket the same as your project. To create a
# bucket:
#
#   $ gsutil mb gs://<your-bucket-name>
#
# You also need to make sure that the default ACL is set to public-read,
# otherwise users will not be able to see their upload images:
#
#   $ gsutil defacl set public-read gs://<your-bucket-name>
#
# You can adjust the max content length and allow extensions settings to allow
# larger or more varied file types if desired.
GOOGLE_STORAGE_BUCKET = os.environ.get('GOOGLE_STORAGE_BUCKET', 'ml-lab-demo')
MAX_CONTENT_LENGTH = 8 * 1024 * 1024
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

# OAuth2 configuration.
# This can be generated from the Google Developers Console at
# https://console.developers.google.com/project/_/apiui/credential.
# Note that you will need to add all URLs that your application uses as
# authorized redirect URIs. For example, typically you would add the following:
#
#  * http://localhost:8080/oauth2callback
#  * https://<your-app-id>.appspot.com/oauth2callback.
#
# If you receive a invalid redirect URI error review you settings to ensure
# that the current URI is allowed.
GOOGLE_OAUTH2_CLIENT_ID = os.environ.get('GOOGLE_OAUTH2_CLIENT_ID', '777754064427-b2ocvb3p2fb0g58fijjkh2eelii1ttjr.apps.googleusercontent.com')
GOOGLE_OAUTH2_CLIENT_SECRET = os.environ.get('GOOGLE_OAUTH2_CLIENT_SECRET', 'fHah3EgbReZCzXbM8-tECTHQ')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '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')
SENDGRID_SENDER_EMAIL = os.environ.get('SENDGRID_SENDER_EMAIL', 'pvinaydatta@gmail.com')
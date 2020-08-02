#!/bin/sh
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-users ./microservices/users/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-checkout ./microservices/checkout/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-catalog ./microservices/catalog/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-frontend ./microservices/frontend/
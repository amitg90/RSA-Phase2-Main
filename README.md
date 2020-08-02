# RSA-Core

# Checkout Instructions
git clone -b RSA-V2 https://github.com/tadinve/RSA-Core.git

# Build and load in kubernetes instructions
<Will Add>


# Build images for backend services
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-users ./microservices/users/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-checkout ./microservices/checkout/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-catalog ./microservices/catalog/
gcloud builds submit --tag gcr.io/ml-lab-demo/rsa-frontend ./microservices/frontend/
# Set cluster zone
gcloud config set compute/zone us-central1-a

# Create cluster
gcloud container clusters create rsa-v2
gcloud container clusters get-credentials rsa-v2

# Create deployments
kubectl apply -f microservices/k8s-v2/deployments/
kubectl apply -f microservices/k8s-v2/services/

# List your pods with IP address
kubectl get pods -l app=rsa-users -o wide
kubectl get pods -l app=rsa-checkout -o wide
kubectl get pods -l app=rsa-catalog -o wide

# Describe service and make sure the IP listed are part of service
kubectl describe svc rsa-users
kubectl describe svc rsa-checkout
kubectl describe svc rsa-catalog

kubectl get ep rsa-users # use ep for listing only endpoints

# Test your service

kubectl port-forward <rsa-catalog-podname> 8080:8080
curl 127.0.0.1:8080
or

kubectl exec -it <rsa-catalog-podname> -- /bin/bash
curl 127.0.0.1:8080

FROM node:alpine as builder
WORKDIR '/app'

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ARG REACT_APP_USERS_SERVICE_URL
ENV REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL
ARG REACT_APP_CATALOG_SERVICE_URL
ENV REACT_APP_CATALOG_SERVICE_URL=$REACT_APP_CATALOG_SERVICE_URL
ARG REACT_APP_CHECKOUT_SERVICE_URL
ENV REACT_APP_CHECKOUT_SERVICE_URL=$REACT_APP_CHECKOUT_SERVICE_URL

COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
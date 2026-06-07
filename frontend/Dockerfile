FROM node:24 AS construccion

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM nginx:alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=construccion /usr/app/dist /usr/share/nginx/html

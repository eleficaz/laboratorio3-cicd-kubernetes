FROM node:24-alpine AS construccion
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /usr/app

COPY --from=construccion /usr/app .

EXPOSE 3000

CMD ["node", "dist/main.js"]




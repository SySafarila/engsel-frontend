FROM node:20.17

WORKDIR /app

COPY package.json /app/

RUN npm install -g pnpm

RUN pnpm install

COPY . /app/

RUN npm run build

EXPOSE 3000

CMD [ "npx", "next", "start" ]
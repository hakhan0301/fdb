FROM node:17

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY packages/ packages/
COPY apps/web/package.json apps/web/package.json

RUN npm i 

WORKDIR /usr/src/app/packages/db
RUN npx prisma db push

WORKDIR /usr/src/app
COPY . .
RUN npm i 

WORKDIR /usr/src/app/apps/web
RUN npm run build

CMD [ "npm", "start" ]
EXPOSE 3000

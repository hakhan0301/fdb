FROM node:17

WORKDIR /usr/src/app

COPY . .
RUN npm ci


WORKDIR /usr/src/app/packages/db
RUN npx prisma db push

WORKDIR /usr/src/app/apps/web
RUN rm .env
RUN mv .prod.env .env
RUN npm run build

CMD [ "npm", "start" ]
EXPOSE 3000
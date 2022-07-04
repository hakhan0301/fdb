FROM node:17

WORKDIR /usr/src/app

COPY . .
RUN find -not -type d -not -name "package*.json"  | xargs rm -f
RUN find . -empty -type d -delete

# ----------- build stage 2
FROM node:17

EXPOSE 3000
CMD [ "npm", "start" ]

WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .

RUN npm i 

COPY . .

RUN npm run build

WORKDIR /usr/src/app/apps/web


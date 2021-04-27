FROM node:15.14-alpine3.10
WORKDIR /app

COPY package.json yarn.lock serverless.yml webpack.config.js ./
RUN yarn install --ignore-scripts

COPY tsconfig.json tslint.json  ./
COPY src src

EXPOSE 3000/tcp

ENTRYPOINT ["yarn", "run", "docker-dev"]


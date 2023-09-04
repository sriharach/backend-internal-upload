FROM node:18.16.0-alpine

WORKDIR /app
RUN apk add g++ make py3-pip

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 4012

# Command to start the Fastify server
CMD ["node", "server.js"]
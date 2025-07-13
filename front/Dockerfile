FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server

COPY build/ ./build

EXPOSE 8080

CMD ["http-server", "build", "-p", "8080"]
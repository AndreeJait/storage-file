FROM node:alpine

RUN apk update && apk add ca-certificates openssl

RUN update-ca-certificates

RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/* \
    mkdir /usr/local/share/ca-certificates/extra

# COPY .docker/other/cert_Intertrials-CA.crt /usr/local/share/ca-certificates/extra
RUN update-ca-certificates

RUN mkdir /app
ADD . /app
WORKDIR /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

RUN npm install

CMD /wait && npm run dev
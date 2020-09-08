#hns server docker form centos
FROM alpine/node
MAINTAINER jaxchow <jaxchow@gmail.com>

ADD "./" "/app/"
WORKDIR /app/
EXPOSE 4000
ENTRYPOINT [ "npm","start" ]

#hns server docker form centos
FROM alpine/node
MAINTAINER jaxchow <jaxchow@gmail.com>
#WORKDIR /app/
ADD "./" "/app/"
EXPOSE 4000
#CMD ["/bin/sh","-c","while sleep 1000; do :; done"]
#ENTRYPOINT [ "/bin/bash", "-c", "--","while true; do sleep 30; done;" ]
#ENTRYPOINT [ "npm","start" ]
#ENTRYPOINT [ "/bin/bash", "-ce", "tail -f /dev/null" ]
ENTRYPOINT ["/bin/sh","-c","while sleep 1000; do :; done"]

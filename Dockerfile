FROM node:6.9
RUN npm i -g yarn

WORKDIR /opt/hejmdal

ADD package.json /opt/hejmdal
RUN yarn install

ADD . /opt/hejmdal
EXPOSE 3010

ADD docker/start_hejmdal.sh /bin/start_hejmdal.sh
RUN ["chmod", "+x", "/bin/start_hejmdal.sh"]

CMD ["/bin/start_hejmdal.sh"]

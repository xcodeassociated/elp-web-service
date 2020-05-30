FROM node:latest
ENV APP_HOME=/usr/local/app/
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]

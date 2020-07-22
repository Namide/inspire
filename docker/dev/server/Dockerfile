FROM node:slim
# RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /home/node/app
# RUN chmod -R 777 /home/node
COPY ./server/package*.json ./
RUN npm install
USER node
# COPY --chown=node:node . .
EXPOSE 8080
CMD [ "npm", "run", "dev" ]

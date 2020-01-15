FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "livestream.js"]
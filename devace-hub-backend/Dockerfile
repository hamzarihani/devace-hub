FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Run build for production readiness, though dev will use volumes
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

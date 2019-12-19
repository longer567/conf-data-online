FROM node:10.16.3
COPY . /app
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "start"]
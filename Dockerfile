FROM node:gallium-alpine3.14
WORKDIR /pir
ENV NODE_ENV=production

#copy application files
COPY pir .
RUN npm i 
RUN chmod 766 "./packages/ffprobe-static/bin/linux/arm64/ffprobe"

CMD node src/index.js
EXPOSE 4000
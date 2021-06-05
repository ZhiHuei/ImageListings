FROM node:12.16.0

# Create app directory
RUN mkdir -p /usr/src/imagelisting
WORKDIR /usr/src/imagelisting

# Install app dependencies
COPY package.json /usr/src/imagelisting
RUN npm install 

# Bundle app source 
COPY . /usr/src/imagelisting
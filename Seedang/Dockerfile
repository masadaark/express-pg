# Stage 1: Build Node.js project
FROM node:18 as node
ARG buildStage
ENV BUILD_STAGE $buildStage
ENV DOCKER_PORT $dockerport
RUN mkdir /seedang
COPY . /seedang
WORKDIR /seedang
RUN npm i
RUN sed -i 's/\r$//' run-dev.bash

# Stage 2: Build Java project and run tasks

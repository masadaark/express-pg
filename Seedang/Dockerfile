FROM node:18
ARG buildStage
ENV BUILD_STAGE $buildStage
RUN mkdir /seedang
COPY . /seedang
WORKDIR /seedang
RUN npm install
RUN sed -i 's/\r$//' run-dev.bash

CMD ["bash", "./run-dev.bash"]
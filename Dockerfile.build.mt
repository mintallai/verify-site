FROM docker-asr-release.dr.corp.adobe.com/asr/static_builder_node_v12:1.0.0

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y libpng-dev yarn


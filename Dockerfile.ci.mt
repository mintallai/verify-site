FROM mcr.microsoft.com/playwright:v1.17.1-focal
WORKDIR /build
ADD . .
RUN yarn install
RUN npx playwright install
ENTRYPOINT /bin/bash -e ci.sh

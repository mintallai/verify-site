FROM mcr.microsoft.com/playwright:v1.22.2-focal
WORKDIR /build
ADD . .
RUN yarn install
RUN npx playwright install
ENTRYPOINT /bin/bash -e ci.sh

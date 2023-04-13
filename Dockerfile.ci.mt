FROM mcr.microsoft.com/playwright:v1.22.2-focal
WORKDIR /build
ADD . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpx playwright install
ENTRYPOINT /bin/bash -e ci.sh

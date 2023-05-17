# This should be the version of @playwright/test declared in package.json to avoid errors
FROM mcr.microsoft.com/playwright:v1.33.0-focal

RUN apt-get update && \
    apt-get install -y curl zip
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip -q awscliv2.zip
RUN ./aws/install -i /usr/local/aws-cli -b /usr/local/bin

WORKDIR /build
ADD . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm exec playwright install
ENTRYPOINT /bin/bash -e ci.sh

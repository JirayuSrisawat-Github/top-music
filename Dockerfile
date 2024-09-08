FROM oven/bun:1
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN bun install
RUN bun run build
CMD ["bun", "start"]
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run --filter api... -r build
RUN mkdir -p /prod/api
RUN pnpm --filter=api --prod deploy /prod/api/

FROM base AS api
COPY --from=build /usr/src/app/apps/api/dist /app/dist
COPY --from=build /prod/api/node_modules /app/node_modules
WORKDIR /app
EXPOSE 3333
CMD [ "node", "--env-file=.env", "dist/infra/main.js" ]  
# CMD [ "tail", "-f", "/dev/null" ]  
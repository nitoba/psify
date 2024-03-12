FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run --filter api... -r build
RUN pnpm deploy --filter=api --prod /prod/api

FROM base AS api
COPY --from=build /dist /app
# COPY --from=build /prod/api/dist /prod/dist
# COPY --from=build /prod/api/node_modules /prod/node_modules/
# WORKDIR /prod/api
# EXPOSE 3333
# CMD [ "pnpm", "start:prod" ]  
CMD [ "tail", "-f", "/dev/null" ]  

# FROM base AS app2
# COPY --from=build /prod/app2 /prod/app2
# WORKDIR /prod/app2
# EXPOSE 8001
# CMD [ "pnpm", "start" ]
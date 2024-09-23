## Quickstart

1. Go to your app's directory and install packages.

```sh
cd project-name && pnpm i
```

2. You can delete the `.gitmodules` file. You can also remove the `extensions` folder, if you don't want to deal with installing `Ruby` etc for theme app extensions.

3. Go to `project-name/web/backend` folder and rename `.env.example` to `.env` and fill the values. Do the same for `project-name/web/frontend` folder. You can create a new app on the shopify partner's dashboard if you don't have one.

4. Go to the root of the project and run the following command to start the docker containers,
  
```sh
docker-compose up -d
```


5. You can remove the web/backend/prisma/migrations folder. Make sure your database schema is already created and then run,

```sh
cd web/backend && npx prisma migrate dev
```

6. You can copy the `shopify.app.toml` file to `shopify.app.local.toml` and then link the config file to the app,
  
  ```sh
  cp shopify.app.toml shopify.app.local.toml
  pnpm shopify app config link
  pnpm shopify app config use local
  ```

7. Go to your app's directory and then run the app,

```sh
cd project-name && pnpm dev
```

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

## Deployment

1. fly.ioを利用してデプロイすることができます。
   https://fly.io/
   アクセスしたら手順に従いデプロイするためのガイダンスが表示されるので従います。

2. flyctlをインストールします。（1.でインストールしていたら不要です。）

```sh
brew install flyctl
```

3. アプリを仮デプロイします。
   設定は任意で行います。

```sh
fly launch
```

4. データベースをセットアップします。
   設定は任意で行います。

```sh
flyctl postgres create
```

5. アプリに必要なランタイム環境変数を設定します。
   作成したpostgresの接続情報やshopifyのapi_keyなどを設定します。

```sh
// データベース接続情報やapi_keyなどは任意に書き換えてください。
flyctl secrets set DATABASE_URL="postgres://username:password@host:port/dbname"
flyctl secrets set SHOPIFY_API_KEY="your_shopify_api_key"
flyctl secrets set SHOPIFY_API_SECRET="your_shopify_api_secret"
flyctl secrets set HOST="your_host"
```

6. アプリを改めてデプロイします。ビルド時の環境変数も設定が必要です。

```sh
flyctl deploy --build-args SHOPIFY_API_KEY="your_shopify_api_key"
```

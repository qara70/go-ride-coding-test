FROM node:18-alpine

ARG VITE_HOST
ARG SHOPIFY_API_KEY
ARG VITE_APP_SLUG
ARG VITE_MP_TOKEN
ARG VITE_BS_TOKEN
ENV VITE_HOST=$VITE_HOST
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV VITE_APP_SLUG=$VITE_APP_SLUG
ENV VITE_MP_TOKEN=$VITE_MP_TOKEN
ENV VITE_BS_TOKEN=$VITE_BS_TOKEN
ENV BUILD_ENV=docker

EXPOSE 8081

WORKDIR /app

# パッケージファイルをコピー
COPY package.json package.json
COPY web/frontend/package.json frontend/package.json
COPY web/backend/package.json backend/package.json

# フロントエンドとバックエンドのソースコードを先にコピー
COPY web/@types @types
COPY web/frontend frontend
COPY web/backend backend

# 依存関係をインストール
RUN npm --prefix ./frontend install
RUN npm --prefix ./backend install --legacy-peer-deps

# フロントエンドのビルド
WORKDIR /app/frontend
RUN npm run build

# バックエンドの準備とビルド
WORKDIR /app/backend
RUN npm run prepare
RUN npm run build

# サーバーを起動
CMD npm start
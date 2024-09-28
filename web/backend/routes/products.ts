import express from "express";
import shopify from "../shopify";
import {
  GET_PRODUCT_VARIANTS,
  GET_PRODUCTS,
  UPDATE_PRODUCT_PRICE,
} from "../graphql/routes/products-graphql";
import productCreator from "../services/product-creator";
import { execUpdatingProductTitle } from "../tasks/exec-updating-product-title";
import { getUpdateTitleTaskStatus } from "../services/task/product/product-service";

const productRoutes = express.Router();

/**
 * 商品一覧を取得する
 */
productRoutes.get("/", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    const products = await client.query({
      data: GET_PRODUCTS,
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

/**
 * 商品価格を更新する
 */
productRoutes.get("/variant", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    const updatedProduct = await client.query({
      data: GET_PRODUCT_VARIANTS,
    });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

/**
 * 商品価格を更新する
 */
productRoutes.post("/variant", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    const input = req.body;
    const updatedProduct = await client.query({
      data: {
        query: UPDATE_PRODUCT_PRICE,
        variables: {
          ...input,
        },
      },
    });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

/**
 * タイトル更新するジョブステータスを取得する
 */
productRoutes.get("/task/title", async (req, res) => {
  try {
    const shop = res.locals.shopify.session.shop;
    const task = await getUpdateTitleTaskStatus(shop);
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

/**
 * 商品タイトルを1時間毎にランダムに変更するジョブを実行する
 */
productRoutes.post("/task/title", async (req, res) => {
  // cronジョブを定義
  const shop = res.locals.shopify.session.shop;
  console.log("body check", req.body);
  const enabled = req.body.enabled;
  execUpdatingProductTitle(shop, enabled);
});

productRoutes.get("/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

productRoutes.post("/create/:product_count", async (req, res) => {
  const { product_count } = req.params;
  try {
    await productCreator(res.locals.shopify.session, +product_count);
    res.status(200).send();
  } catch (e) {
    console.log(`Failed to process products/create: ${(e as Error).message}`);
    res.status(500).send((e as Error).message);
  }
});

export default productRoutes;

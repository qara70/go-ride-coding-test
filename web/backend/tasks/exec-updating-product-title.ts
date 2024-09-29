import shopify from "../shopify";
import {
  GET_PRODUCT_FOR_UPDATE,
  UPDATE_PRODUCT_TITLE,
} from "../graphql/routes/products-graphql";
import { updateRandomTitle } from "../services/product-creator";
import * as cron from "node-cron";
import sessions from "../prisma/database/sessions";
import prisma from "../prisma/database/client";
import { logError, logInfo } from "../utils/logger";
import { TASK_TITLE_UPDATE_STATUS } from "../utils/constants/tasks";
import { GraphqlClient } from "@shopify/shopify-api/lib/clients/graphql/graphql_client";
import { Session } from "@shopify/shopify-api";

// GraphQLのクエリ結果に対応する型を定義
interface Product {
  node: {
    id: string;
    title: string;
  };
}

interface ProductResponse {
  data: {
    products: {
      edges: Product[];
    };
  };
}

// リトライの回数と間隔を定義
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;

// cron タスクをショップごとに保持するマップ
const cronTasks: { [shop: string]: cron.ScheduledTask } = {};

// リトライ用の関数
const retryWithDelay = async (
  fn: () => Promise<unknown>,
  retryCount = 0
): Promise<unknown> => {
  try {
    return await fn();
  } catch (error) {
    if (retryCount < MAX_RETRY_COUNT) {
      logError(
        `Retrying due to error retry count: ${retryCount + 1}`,
        error as Error
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // 一定時間待機
      return retryWithDelay(fn, retryCount + 1);
    } else {
      logError(`Failed after ${MAX_RETRY_COUNT}`, error as Error);
      throw error;
    }
  }
};

// 商品を1件ずつ更新する処理
const updateProductTitle = async (client: GraphqlClient, product: Product) => {
  const newTitle = updateRandomTitle(product.node.title);
  try {
    await retryWithDelay(() =>
      client.query({
        data: {
          query: UPDATE_PRODUCT_TITLE,
          variables: {
            input: {
              id: product.node.id,
              title: newTitle,
            },
          },
        },
      })
    );
    logInfo(`Successfully updated product: ${product.node.id}`);
  } catch (error) {
    logError(`Failed to update product ${product.node.id}`, error as Error);
  }
};

const cronTask = (session: Session) => {
  return cron.schedule("* * * * *", async () => {
    try {
      const client = new shopify.api.clients.Graphql({ session });
      const products = await client.query<ProductResponse>({
        data: GET_PRODUCT_FOR_UPDATE,
      });

      for (const product of products.body.data.products.edges) {
        await updateProductTitle(client, product);
      }
    } catch (error) {
      logError(`Error in cron job: ${(error as Error).message}`);
    }
  });
};

export const execUpdatingProductTitle = async (
  shop: string,
  enabled: boolean
) => {
  logInfo(`exec cron job for shop: ${shop} enabled: ${enabled}`);
  const fetchedSessions = await sessions.findSessions(shop);
  if (!fetchedSessions.length && enabled) {
    return;
  }
  const session = fetchedSessions[0];
  // cronジョブがすでに存在しているか確認
  if (enabled) {
    if (cronTasks[shop]) {
      logInfo(`Cron job already running for shop: ${shop}`);
    } else {
      logInfo(`Starting new cron job for shop: ${shop}`);

      // 新しいcronジョブを作成
      const task = cronTask(session);
      // タスクをマップに保存
      cronTasks[shop] = task;
      task.start();

      await prisma.cronTitleUpdate.upsert({
        where: { shop },
        update: { status: TASK_TITLE_UPDATE_STATUS.RUNNING },
        create: {
          shop,
          status: TASK_TITLE_UPDATE_STATUS.RUNNING,
        },
      });
    }
  } else {
    logInfo(`Stopping cron job for shop: ${cronTasks[shop]}`);

    if (cronTasks[shop]) {
      logInfo(`Stopping cron job for shop: ${shop}`);
      cronTasks[shop].stop();
      delete cronTasks[shop]; // マップからタスクを削除

      await prisma.cronTitleUpdate.upsert({
        where: { shop },
        update: { status: TASK_TITLE_UPDATE_STATUS.STOPPED },
        create: {
          shop,
          status: TASK_TITLE_UPDATE_STATUS.STOPPED,
        },
      });
    }
  }
};

export async function updateAllShopProductTitle() {
  logInfo("Start updating product title for all shops");
  const shops = await prisma.shop.findMany({
    where: {
      isInstalled: true,
    },
    select: {
      shop: true,
    },
  });

  for (const shop of shops) {
    logInfo(`Updating product title for shop: ${shop.shop}`);
    await execUpdatingProductTitle(shop.shop, true);
  }
}

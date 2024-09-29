import type { Session } from "@shopify/shopify-api";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import expressServeStaticGzip from "express-static-gzip";
import { readFileSync } from "fs";
import { join } from "path";
import shopify from "./shopify";

// Import Middleware
import updateShopDataMiddleware from "./middleware/shopData";

// Import Webhooks
import PrivacyWebhookHandlers from "./webhooks/privacy";
import addUninstallWebhookHandler from "./webhooks/uninstall";

// Import Routes
import billingRoutes, {
  billingUnauthenticatedRoutes,
} from "./routes/billing/index";
import blockRoutes from "./routes/blocks";
import productRoutes from "./routes/products";
import shopRoutes from "./routes/shop";
import { updateAllShopProductTitle } from "./tasks/exec-updating-product-title";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "8081",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/../frontend/dist`
    : `${process.cwd()}/../frontend/`;

const app = express();

// Set up Shopify authentication
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  updateShopDataMiddleware(app),
  shopify.redirectToShopifyOrAppRoot()
);

// Set up Shopify webhooks handling
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);
await addUninstallWebhookHandler();

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

// Unauthenticated routes
app.use("/api/billing", billingUnauthenticatedRoutes);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

// Print all requested paths
app.use("/*", (req: Request, res: Response, next: NextFunction) => {
  const shop = req.query.shop;
  if (shop) {
    console.log("-->", req.baseUrl + req.path, "| { shop: " + shop + " }");
  }
  return next();
});

app.use("/api/*", (req: Request, res: Response, next: NextFunction) => {
  const session: Session = res.locals?.shopify?.session;
  console.log("session is ...", session);
  const shop = session?.shop;
  console.log("-->", req.baseUrl + req.path, "| { shop: " + shop + " }");
  return next();
});

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/block", blockRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/billing", billingRoutes);

app.use(shopify.cspHeaders());
app.use(
  expressServeStaticGzip(STATIC_PATH, {
    enableBrotli: true,
    index: false,
    orderPreference: ["br", "gz"],
  })
);

// Reply to health check to let server know we are ready
app.use("/health", (_req, res) => {
  res.status(200).send();
});

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

const server = app.listen(PORT, async () => {
  console.log(`App running on port: ${PORT} ...`);
  await updateAllShopProductTitle();
  console.log("All shop product title updated ...");
});
server.timeout = 1000 * 60 * 5;

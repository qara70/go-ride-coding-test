import {
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUpdateProductTitle } from "../hooks";
import { Product, ProductList } from "../components/ProductList";
import { ProductsResponse, useGetProducts } from "../hooks/useGetProducts";
import {
  TaskStatusResponse,
  useGetUpdateTitleTaskStatus,
} from "../hooks/useGetUpdateTitleTaskStatus";
import { TASK_TITLE_UPDATE_STATUS } from "../utils/constants/tasks";

export default function PageBackend() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetProducts();
  const {
    data: task,
    isLoading: isLoadingTaskStatus,
    isError: isErrorTaskStatusError,
    error: taskStatusError,
  } = useGetUpdateTitleTaskStatus();
  const { mutate: execCron } = useUpdateProductTitle();

  const [multiClick, setMultiClick] = useState(false);
  const [taskState, setTaskState] = useState<TaskStatusResponse | null>(null);

  useEffect(() => {
    if (task) {
      setTaskState(task as TaskStatusResponse);
    }
  }, [task]);

  if (isError || isErrorTaskStatusError) {
    throw new Error(
      `getProductsError: ${error}, taskStatusError: ${taskStatusError}`
    );
  }

  if (isLoading || isLoadingTaskStatus) {
    return <p>Loading...</p>;
  }

  const productList = data as ProductsResponse;
  const products: Product[] = productList.body.data.products.edges.map(
    (edge) => {
      return {
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.priceRangeV2.minVariantPrice.amount,
        currencyCode: edge.node.priceRangeV2.minVariantPrice.currencyCode,
        imageUrl: edge.node.images.edges?.[0]?.node?.src ?? "",
      };
    }
  );

  const handleUpdateProductTitle = async () => {
    if (multiClick) {
      return;
    }
    setMultiClick(true);
    try {
      execCron(taskState?.status !== TASK_TITLE_UPDATE_STATUS.RUNNING);
      setTaskState({
        ...taskState,
        status:
          taskState.status === TASK_TITLE_UPDATE_STATUS.RUNNING
            ? TASK_TITLE_UPDATE_STATUS.STOPPED
            : TASK_TITLE_UPDATE_STATUS.RUNNING,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setMultiClick(false);
    }
  };

  return (
    <Page
      title="Page Backend"
      fullWidth
      backAction={{
        content: "Back",
        onAction: () => navigate(-1),
      }}
    >
      <Layout>
        <Layout.Section>
          <Button
            loading={isLoading || multiClick}
            disabled={!taskState}
            onClick={async () => {
              handleUpdateProductTitle();
            }}
          >
            {taskState.status !== TASK_TITLE_UPDATE_STATUS.RUNNING
              ? "Cronを実行する"
              : "Cronを停止する"}
          </Button>
          <Card>
            <InlineStack gap={"200"} align="space-between" blockAlign="center">
              <Text variant="headingMd" as="h1">
                Page Backend Example
              </Text>
            </InlineStack>
            <ProductList products={products} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

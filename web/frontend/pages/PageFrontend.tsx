import { Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import {
  Product,
  InputProductPriceList,
} from "../components/InputProductPriceList";
import { useNavigate } from "react-router";
import {
  ProductVariantsResponse,
  useGetProductVariants,
} from "../hooks/useGetProductVariants";
import { useEffect, useState } from "react";
import {
  UpdateProductTitleInput,
  useUpdateProductTitle,
} from "../hooks/useUpdateProductPrice";

export default function PageFrontend() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetProductVariants();
  const mutation = useUpdateProductTitle();
  const [multiClick, setMultiClick] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [productsState, setProductsState] = useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      const productList = data as ProductVariantsResponse;
      const products: Product[] =
        productList.body.data.productVariants.edges.map((edge) => {
          return {
            id: edge.node.id,
            title: edge.node.displayName,
            price: edge.node.price,
            imageUrl: edge.node.image?.url ?? "",
          };
        });

      console.log("products", products);
      setProductsState(products);
    }
  }, [data]);

  if (isError) {
    throw new Error(`getProductsError: ${error}`);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handlePriceUpdating = async (id: string, price: string) => {
    try {
      if (multiClick) {
        return;
      }
      setMultiClick(true);
      setIsLoadingUpdate(true);
      const input: UpdateProductTitleInput = {
        id,
        price,
      };
      await mutation.mutateAsync(input);
    } catch (error) {
      console.log(error);
    } finally {
      setMultiClick(false);
      setIsLoadingUpdate(false);
    }
  };

  return (
    <Page
      title="Page Frontend"
      fullWidth
      backAction={{
        content: "Back",
        onAction: () => navigate(-1),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack gap={"200"} align="space-between" blockAlign="center">
              <Text variant="headingMd" as="h1">
                Page Backend Example
              </Text>
            </InlineStack>
            <InputProductPriceList
              state={[productsState, setProductsState]}
              loading={isLoadingUpdate}
              handleClick={handlePriceUpdating}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

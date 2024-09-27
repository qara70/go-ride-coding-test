import {
  ResourceItem,
  ResourceList,
  Thumbnail,
  Text,
  EmptyState,
} from "@shopify/polaris";

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  currencyCode: string;
}

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const emptyStateMarkup = !products.length ? (
    <EmptyState
      heading="商品を登録してください"
      action={{ content: "Upload files" }}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <Text as={"p"} variant="headingSm">
        商品が登録することで利用することができます
      </Text>
    </EmptyState>
  ) : undefined;

  return (
    <ResourceList
      resourceName={{ singular: "product", plural: "products" }}
      items={products}
      emptyState={emptyStateMarkup}
      renderItem={(product) => {
        const { id, title, imageUrl, price, currencyCode } = product;
        const media = <Thumbnail source={imageUrl} alt={title} />;

        return (
          <ResourceItem
            id={id}
            accessibilityLabel={title}
            media={media}
            onClick={() => {}}
          >
            <Text as={"h3"} variant="headingMd">
              {title}
            </Text>
            <Text as={"p"} variant="headingSm">
              {price} {currencyCode}
            </Text>
          </ResourceItem>
        );
      }}
    />
  );
};

import {
  ResourceItem,
  ResourceList,
  Thumbnail,
  Text,
  EmptyState,
  Button,
  InlineStack,
  TextField,
} from "@shopify/polaris";

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
}

interface InputProductPriceListProps {
  state: [Product[], React.Dispatch<React.SetStateAction<Product[]>>];
  loading: boolean;
  handleClick: (id: string, price: string) => void;
}

export const InputProductPriceList: React.FC<InputProductPriceListProps> = ({
  state,
  loading,
  handleClick,
}) => {
  const [productsState, setProductsState] = state;
  const noImage =
    "https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png";
  const emptyStateMarkup = !productsState?.length ? (
    <EmptyState
      heading="商品を登録してください"
      action={{ content: "Upload files" }}
      image={noImage}
    >
      <Text as={"p"} variant="headingSm">
        商品が登録することで利用することができます
      </Text>
    </EmptyState>
  ) : undefined;

  return (
    <ResourceList
      resourceName={{ singular: "product", plural: "products" }}
      items={productsState}
      emptyState={emptyStateMarkup}
      renderItem={(product) => {
        const { id, title, imageUrl, price } = product;
        const media = (
          <Thumbnail source={imageUrl ? imageUrl : noImage} alt={title} />
        );
        const handleChange = (value: string) => {
          const newProducts = productsState.map((product) => {
            if (product.id === id) {
              return {
                ...product,
                price: value,
              };
            }
            return product;
          });
          setProductsState(newProducts);
        };

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
            <InlineStack>
              <TextField
                label={`価格`}
                type="number"
                value={price}
                autoComplete="off"
                onChange={handleChange}
              />
            </InlineStack>
            <Button onClick={() => handleClick(id, price)} loading={loading}>
              価格更新
            </Button>
          </ResourceItem>
        );
      }}
    />
  );
};

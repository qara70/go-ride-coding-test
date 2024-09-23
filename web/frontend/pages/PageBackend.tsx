import { Card, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useNavigate } from "react-router";

export default function PageBackend() {
  const navigate = useNavigate();

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
          <Card>
            <InlineStack gap={"200"} align="space-between" blockAlign="center">
              <Text variant="headingMd" as="h1">
                Page Backend Example
              </Text>
            </InlineStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

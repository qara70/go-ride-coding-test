import { TitleBar } from "@shopify/app-bridge-react";
import { ActionList, Card, Layout, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const pagesLinks = [
    {
      content: "Frontend",
      helpText:
        "シンプルな入力フィールドとボタンで、ユーザーが手動で商品の価格を変更できるようにしてください。",
      onAction: () => navigate("/PageFrontend"),
    },
    {
      content: "Backend",
      helpText:
        "1時間ごとに自動的に商品タイトルを変更するcronジョブを作成してください。",
      onAction: () => navigate("/PageBackend"),
    },
  ];

  return (
    <Page>
      <TitleBar title={"GO RIDE coding test"} primaryAction={null} />
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card padding={"0"}>
            <ActionList actionRole="menuitem" items={pagesLinks} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

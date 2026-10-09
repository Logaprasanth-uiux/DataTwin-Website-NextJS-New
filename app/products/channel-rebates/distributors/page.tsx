import { ProductPage } from "@/components/product-page/ProductPage";
import { channelRebatesDistributors } from "@/components/product-page/data/channel-rebates-distributors";

export const metadata = channelRebatesDistributors.metadata;

export default function ChannelRebatesDistributorsPage() {
  return <ProductPage data={channelRebatesDistributors} />;
}

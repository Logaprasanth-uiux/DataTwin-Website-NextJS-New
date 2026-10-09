import { ProductPage } from "@/components/product-page/ProductPage";
import { channelRebates } from "@/components/product-page/data/channel-rebates";

export const metadata = channelRebates.metadata;

export default function ChannelRebatesPage() {
  return <ProductPage data={channelRebates} />;
}

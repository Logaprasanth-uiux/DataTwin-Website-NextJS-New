import { ProductPage } from "@/components/product-page/ProductPage";
import { channelRebatesManufacturers } from "@/components/product-page/data/channel-rebates-manufacturers";

export const metadata = channelRebatesManufacturers.metadata;

export default function ChannelRebatesManufacturersPage() {
  return <ProductPage data={channelRebatesManufacturers} />;
}

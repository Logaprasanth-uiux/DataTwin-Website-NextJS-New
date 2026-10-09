import { ProductPage } from "@/components/product-page/ProductPage";
import { partnerPayouts } from "@/components/product-page/data/partner-payouts";

export const metadata = partnerPayouts.metadata;

export default function PartnerPayoutsPage() {
  return <ProductPage data={partnerPayouts} />;
}

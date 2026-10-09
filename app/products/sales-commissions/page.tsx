import { ProductPage } from "@/components/product-page/ProductPage";
import { salesCommissions } from "@/components/product-page/data/sales-commissions";

export const metadata = salesCommissions.metadata;

export default function SalesCommissionsPage() {
  return <ProductPage data={salesCommissions} />;
}

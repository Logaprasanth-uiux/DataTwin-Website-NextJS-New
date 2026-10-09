import { ProductPage } from "@/components/product-page/ProductPage";
import { taxationReconciliation } from "@/components/product-page/data/taxation-reconciliation";

export const metadata = taxationReconciliation.metadata;

export default function TaxationReconciliationPage() {
  return <ProductPage data={taxationReconciliation} />;
}

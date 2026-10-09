import { ProductPage } from "@/components/product-page/ProductPage";
import { reconciliationAudit } from "@/components/product-page/data/reconciliation-audit";

export const metadata = reconciliationAudit.metadata;

export default function ReconciliationAuditPage() {
  return <ProductPage data={reconciliationAudit} />;
}

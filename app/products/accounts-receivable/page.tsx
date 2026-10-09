import { ProductPage } from "@/components/product-page/ProductPage";
import { accountsReceivable } from "@/components/product-page/data/accounts-receivable";

export const metadata = accountsReceivable.metadata;

export default function AccountsReceivablePage() {
  return <ProductPage data={accountsReceivable} />;
}

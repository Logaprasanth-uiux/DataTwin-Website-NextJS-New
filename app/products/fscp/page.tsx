import { ProductPage } from "@/components/product-page/ProductPage";
import { fscp } from "@/components/product-page/data/fscp";

export const metadata = fscp.metadata;

export default function FscpPage() {
  return <ProductPage data={fscp} />;
}

import { DarpEngineStack } from "./DarpEngineStack";
import { DarpEngineWide } from "./DarpEngineWide";

// The DARP visualization: the horizontal engine from tablet up, a vertical recomposition on phones.
export function DarpEngine() {
  return (
    <>
      <DarpEngineWide className="hidden md:block" />
      <DarpEngineStack className="md:hidden" />
    </>
  );
}

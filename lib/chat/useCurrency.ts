"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createCurrencyFormatter, detectCurrencyKey } from "@/lib/currency";

// Same hydration-safe locale/currency detection pattern used by LossIndicator: the formatter is
// only resolved on the client, so the server-rendered markup never has to guess the visitor's
// currency.

const subscribeNever = () => () => {};
const getKeyOnServer = (): string | null => null;

export function useCurrencyFormatter() {
  const currencyKey = useSyncExternalStore(subscribeNever, detectCurrencyKey, getKeyOnServer);
  const formatter = useMemo(() => createCurrencyFormatter(currencyKey ?? "en-IN|INR"), [currencyKey]);
  return { formatter, ready: currencyKey !== null };
}

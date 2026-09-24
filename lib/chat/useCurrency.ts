"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createCompactCurrencyFormatter, createCompactIndianFormatter, createCurrencyFormatter, detectCurrencyKey } from "@/lib/currency";

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

// Compact Indian financial formatting ("₹28.9 lakh") for the recovery/reconciliation figures
// specifically (Executive Summary, recovery-areas breakdown, detailed findings) — every other
// amount in the app keeps using `useCurrencyFormatter` above unchanged.
export function useRecoveryFormatter() {
  const currencyKey = useSyncExternalStore(subscribeNever, detectCurrencyKey, getKeyOnServer);
  const formatter = useMemo(() => {
    const key = currencyKey ?? "en-IN|INR";
    const [, currency] = key.split("|");
    return currency === "INR" ? createCompactIndianFormatter("₹") : createCompactCurrencyFormatter(key);
  }, [currencyKey]);
  return { formatter, ready: currencyKey !== null };
}

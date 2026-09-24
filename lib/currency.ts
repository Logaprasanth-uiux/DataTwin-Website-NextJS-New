// Display currency and number formatting are derived from the visitor's location
// (single-country timezones) and locale — never from a manual selection or a hardcoded symbol.
// Amounts elsewhere stay currency-agnostic plain numbers.

const TIMEZONE_REGION: Record<string, string> = {
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dubai": "AE",
  "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP",
  "Asia/Hong_Kong": "HK",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Zurich": "CH",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Sao_Paulo": "BR",
  "America/Mexico_City": "MX",
  "Africa/Johannesburg": "ZA",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
};

const EURO_REGIONS = ["DE", "FR", "ES", "IT", "NL", "BE", "AT", "PT", "IE", "FI", "GR", "LU", "SK", "SI", "EE", "LV", "LT", "MT", "CY", "HR"];

const REGION_CURRENCY: Record<string, string> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  JP: "JPY",
  CN: "CNY",
  HK: "HKD",
  KR: "KRW",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  ZA: "ZAR",
  BR: "BRL",
  MX: "MXN",
  ID: "IDR",
  MY: "MYR",
  TH: "THB",
  PH: "PHP",
  NG: "NGN",
  KE: "KES",
  ...Object.fromEntries(EURO_REGIONS.map((region) => [region, "EUR"])),
};

let cachedKey: string | null = null;

// "formatLocale|CURRENCY", computed once per page; the string form keeps it a stable snapshot.
export function detectCurrencyKey(): string {
  if (cachedKey) return cachedKey;

  let locale: Intl.Locale;
  try {
    locale = new Intl.Locale(navigator.languages?.[0] ?? navigator.language ?? "en-US");
  } catch {
    locale = new Intl.Locale("en-US");
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const region = TIMEZONE_REGION[timeZone] ?? locale.region ?? locale.maximize().region ?? "US";
  const currency = REGION_CURRENCY[region] ?? "USD";

  cachedKey = `${locale.language}-${region}|${currency}`;
  return cachedKey;
}

export function createCurrencyFormatter(key: string): Intl.NumberFormat {
  const [locale, currency] = key.split("|");
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat("en-US", options);
  }
}

export interface CompactAmountFormatter {
  format: (amount: number) => string;
}

const LAKH = 100_000;
const CRORE = 1_00_00_000;

// "28.9", never "28.90" or "29.0" — one decimal place, dropped entirely once it's a round number.
function trimToOneDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

// Indian lakh/crore notation for large recovery figures — "₹28.9 lakh" / "₹1.2 Cr" instead of a
// fully-expanded "₹28,90,000.00". Only meaningful for INR; anything below ₹1 lakh (some individual
// finding amounts dip that low) falls back to a plain grouped whole-number amount, since neither
// notation applies yet and the trailing ".00" a currency formatter would add isn't useful here.
export function createCompactIndianFormatter(currencySymbol = "₹"): CompactAmountFormatter {
  return {
    format(amount: number): string {
      const sign = amount < 0 ? "-" : "";
      const abs = Math.abs(amount);
      if (abs >= CRORE) return `${sign}${currencySymbol}${trimToOneDecimal(abs / CRORE)} Cr`;
      if (abs >= LAKH) return `${sign}${currencySymbol}${trimToOneDecimal(abs / LAKH)} lakh`;
      return `${sign}${currencySymbol}${Math.round(abs).toLocaleString("en-IN")}`;
    },
  };
}

// Same compact treatment for non-INR currencies: no lakh/crore (that notation is India-specific),
// just the existing locale-appropriate grouping and symbol without the unnecessary ".00" on
// whole-currency recovery figures.
export function createCompactCurrencyFormatter(key: string): CompactAmountFormatter {
  const [locale, currency] = key.split("|");
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  };
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat("en-US", options);
  }
}

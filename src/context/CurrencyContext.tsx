import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  label: string;
  /** Wisselkoers ten opzichte van de euro (basisvaluta van de shop). */
  rate: number;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "EUR", symbol: "€", flag: "🇪🇺", label: "Euro", rate: 1, locale: "nl-NL" },
  { code: "USD", symbol: "$", flag: "🇺🇸", label: "US Dollar", rate: 1.08, locale: "en-US" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", label: "British Pound", rate: 0.85, locale: "en-GB" },
  { code: "CHF", symbol: "CHF", flag: "🇨🇭", label: "Swiss Franc", rate: 0.94, locale: "de-CH" },
  { code: "PLN", symbol: "zł", flag: "🇵🇱", label: "Złoty", rate: 4.3, locale: "pl-PL" },
  { code: "SEK", symbol: "kr", flag: "🇸🇪", label: "Svensk krona", rate: 11.3, locale: "sv-SE" },
  { code: "TRY", symbol: "₺", flag: "🇹🇷", label: "Türk lirası", rate: 38, locale: "tr-TR" },
  { code: "CNY", symbol: "¥", flag: "🇨🇳", label: "人民币", rate: 7.8, locale: "zh-CN" },
];

interface Ctx {
  currency: Currency;
  setCurrency: (code: string) => void;
  /** Zet een bedrag in euro's om naar de gekozen valuta. */
  format: (amountInEur: number) => string;
  /** Zet een prijstekst als "€35" om naar de gekozen valuta. */
  formatPrice: (price: string) => string;
}

const CurrencyContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "hofs-currency";

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || "EUR");
  const currency = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency.code);
  }, [currency.code]);

  const value = useMemo<Ctx>(() => {
    const format = (amountInEur: number) => {
      const converted = amountInEur * currency.rate;
      const rounded = currency.rate >= 5 ? Math.round(converted) : Math.round(converted * 100) / 100;
      const text = new Intl.NumberFormat(currency.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
      }).format(rounded);
      return currency.code === "EUR" ? `€${text}` : `${currency.symbol}${text}`;
    };
    return {
      currency,
      setCurrency: setCode,
      format,
      formatPrice: (price: string) => {
        const n = parseFloat(String(price).replace(/[^0-9,.]/g, "").replace(",", "."));
        return Number.isFinite(n) ? format(n) : price;
      },
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency moet binnen CurrencyProvider gebruikt worden");
  return ctx;
};

import { Coins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCIES, useCurrency } from "@/context/CurrencyContext";

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 text-foreground transition-colors hover:text-primary"
        aria-label="Currency"
      >
        <Coins className="h-5 w-5" />
        <span className="hidden text-xs font-medium uppercase sm:inline">{currency.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {CURRENCIES.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={currency.code === c.code ? "font-medium text-primary" : ""}
          >
            <span className="mr-2">{c.flag}</span>
            {c.code} — {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;

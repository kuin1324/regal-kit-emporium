import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCENTS, useTheme } from "@/context/ThemeContext";

const AccentSwitcher = () => {
  const { accent, setAccent } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="text-foreground transition-colors hover:text-primary"
        aria-label="Colour theme"
      >
        <Palette className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">
          Colour theme
        </DropdownMenuLabel>
        {ACCENTS.map((a) => (
          <DropdownMenuItem key={a.key} onClick={() => setAccent(a.key)} className="gap-2">
            <span
              className="h-4 w-4 rounded-full border border-border"
              style={{ background: a.swatch }}
            />
            <span className={accent === a.key ? "font-medium text-primary" : ""}>{a.label}</span>
            {accent === a.key && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccentSwitcher;

import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchHero = () => {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/collectie?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="pt-6">
      <div className="container mx-auto px-6">
        <form onSubmit={submit} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Zoek een shirt, team of league..."
            className="w-full pl-12 pr-4 py-4 rounded-full border border-border/60 bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </form>
      </div>
    </section>
  );
};

export default SearchHero;

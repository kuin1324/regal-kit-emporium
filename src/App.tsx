import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ChatWidget from "@/components/ChatWidget";

import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import OverOns from "./pages/OverOns.tsx";
import Collectie from "./pages/Collectie.tsx";
import SpecialEdition from "./pages/SpecialEdition.tsx";
import Retro from "./pages/Retro.tsx";
import LongSleeves from "./pages/LongSleeves.tsx";
import Shorts from "./pages/Shorts.tsx";
import FullKits from "./pages/FullKits.tsx";

import Favorieten from "./pages/Favorieten.tsx";
import NotFound from "./pages/NotFound.tsx";
import Voorraad from "./pages/Voorraad.tsx";
import TrackTrace from "./pages/TrackTrace.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
    <TooltipProvider>
      <CurrencyProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/collectie" element={<Collectie />} />
            <Route path="/special-edition" element={<SpecialEdition />} />
            <Route path="/retro" element={<Retro />} />
            <Route path="/long-sleeve" element={<LongSleeves />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/full-kits" element={<FullKits />} />
            <Route path="/favorieten" element={<Favorieten />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/voorraad" element={<Voorraad />} />
            <Route path="/track-trace" element={<TrackTrace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ChatWidget />

      </CartProvider>
      </CurrencyProvider>
    </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

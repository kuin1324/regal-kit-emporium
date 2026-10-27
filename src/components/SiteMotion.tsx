import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reveal public-page sections without hiding content before JavaScript runs. */
export default function SiteMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/admin" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll("section"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("fluid-reveal");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      sections.forEach((section) => section.classList.remove("fluid-reveal"));
    };
  }, [pathname]);

  return null;
}
import { useEffect, useState } from "react";

const KEY = "hofs-admin";

/** Beheerdersweergave: alleen jij ziet artikelcodes (SKU's).
 *  Aanzetten met ?admin=1 in de URL, uitzetten met ?admin=0. */
export const useAdminView = (): boolean => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("admin");
      if (param === "1") localStorage.setItem(KEY, "1");
      if (param === "0") localStorage.removeItem(KEY);
      setOn(localStorage.getItem(KEY) === "1");
    } catch {
      setOn(false);
    }
  }, []);

  return on;
};

import { useCallback, useEffect, useState } from "react";

/** Kleine helper om "weggedrukte" onderdelen (chatbot, meldingen) te onthouden
 *  én ze weer terug te kunnen halen. */
const EVENT = "hofs-hidden-change";

const read = (key: string) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const write = (key: string, value: boolean) => {
  try {
    if (value) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

export const useHidden = (key: string) => {
  const [hidden, setHidden] = useState(() => read(key));

  useEffect(() => {
    const sync = () => setHidden(read(key));
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const hide = useCallback(() => write(key, true), [key]);
  const restore = useCallback(() => write(key, false), [key]);

  return { hidden, hide, restore };
};

export const notifyHiddenChange = () => window.dispatchEvent(new CustomEvent(EVENT));

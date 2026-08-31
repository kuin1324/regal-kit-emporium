import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Verborgen toegang tot het adminpaneel.
 *
 * Desktop: typ ergens op de site het woord "hofsadmin".
 * Telefoon: tik 7x snel achter elkaar in de linkerbovenhoek (binnen 80x80 px, binnen 4 seconden).
 */
const SECRET = "hofsadmin";

const AdminUnlock = () => {
  const navigate = useNavigate();
  const buffer = useRef("");
  const taps = useRef<number[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (e.key.length !== 1) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer.current === SECRET) {
        buffer.current = "";
        navigate("/admin");
      }
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t || t.clientX > 80 || t.clientY > 80) return;
      const now = Date.now();
      taps.current = [...taps.current.filter((ts) => now - ts < 4000), now];
      if (taps.current.length >= 7) {
        taps.current = [];
        navigate("/admin");
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("touchend", onTouch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchend", onTouch);
    };
  }, [navigate]);

  return null;
};

export default AdminUnlock;

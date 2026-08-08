import { useCallback, useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Props {
  src: string;
  fallback?: string | null;
  alt: string;
}

const MIN = 1;
const MAX = 5;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Foto met zoom (scrollwiel / pinch / knoppen) en slepen om te pannen. */
const ZoomableImage = ({ src, fallback, alt }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [source, setSource] = useState(src);
  const state = useRef({ zoom: 1, offset: { x: 0, y: 0 } });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  state.current = { zoom, offset };

  useEffect(() => {
    setSource(src);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [src]);

  const applyZoom = useCallback((next: number, px: number, py: number) => {
    const { zoom: z, offset: o } = state.current;
    const target = clamp(next, MIN, MAX);
    const k = target / z;
    const nx = target === MIN ? 0 : px - (px - o.x) * k;
    const ny = target === MIN ? 0 : py - (py - o.y) * k;
    setZoom(target);
    setOffset({ x: nx, y: ny });
  }, []);

  const wheelRef = useRef((e: WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
    applyZoom(state.current.zoom * Math.exp(-dy * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
  });
  wheelRef.current = (e: WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
    applyZoom(state.current.zoom * Math.exp(-dy * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelRef.current(e);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const centerZoom = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    applyZoom(state.current.zoom * factor, rect.width / 2, rect.height / 2);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden rounded select-none touch-none ${
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        }`}
        onDoubleClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          applyZoom(zoom > 1 ? 1 : 2.5, e.clientX - rect.left, e.clientY - rect.top);
        }}
        onPointerDown={(e) => {
          if (zoom <= 1) return;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <img
          src={source}
          alt={alt}
          draggable={false}
          decoding="async"
          onError={() => {
            if (fallback && source !== fallback) setSource(fallback);
            else if (source !== "/placeholder.svg") setSource("/placeholder.svg");
          }}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
          className="w-full h-full object-contain will-change-transform"
        />
      </div>

      <div className="absolute bottom-2 right-2 flex gap-1 rounded-full border border-border bg-card/90 p-1 backdrop-blur">
        <button onClick={() => centerZoom(1 / 1.4)} className="rounded-full p-2 hover:bg-muted" aria-label="zoom out">
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="self-center px-1 text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <button onClick={() => centerZoom(1.4)} className="rounded-full p-2 hover:bg-muted" aria-label="zoom in">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="rounded-full p-2 hover:bg-muted"
          aria-label="reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ZoomableImage;

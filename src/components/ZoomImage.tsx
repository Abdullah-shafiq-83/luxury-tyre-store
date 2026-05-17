import { useRef, useState } from "react";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;
}

export function ZoomImage({ src, alt, className = "", zoom = 2.2 }: ZoomImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => !isTouch && setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
      className={`relative overflow-hidden cursor-zoom-in group/zoom ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: active ? 0 : 1 }}
        draggable={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: active ? 1 : 0,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          imageRendering: "auto",
        }}
      />
      {/* Hover glow ring */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          boxShadow:
            "inset 0 0 0 1px rgba(210,36,58,0.45), 0 0 40px rgba(210,36,58,0.25)",
        }}
      />
    </div>
  );
}

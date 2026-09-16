import { useMemo } from "react";

export default function Starfield({ count = 140 }) {
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    return Array.from({ length: count }, () => ({
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: rand() * 1.8 + 0.6,
      delay: `${rand() * 6}s`,
      duration: `${3 + rand() * 5}s`,
    }));
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 nebula">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

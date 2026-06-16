import { useEffect, useState } from "react";

export function useTicker(interval = 500) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, interval);

    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [interval]);

  return now;
}

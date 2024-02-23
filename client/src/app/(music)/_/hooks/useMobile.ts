import { useState, useRef, useEffect, useMemo } from "react";

const useMobile = (threshold: number) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= threshold);
  const previousWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      if (previousWidth.current <= threshold) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      previousWidth.current = currentWidth;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [threshold]);

  const cachedValue = useMemo(() => isMobile, [isMobile]);
  console.log(cachedValue)

  return cachedValue;
};

export { useMobile };

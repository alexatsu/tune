import { useEffect, useState } from "react";

const useMobile = (threshold: number) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setIsMobile(currentWidth <= threshold);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [threshold]);

  return isMobile;
};

export { useMobile };

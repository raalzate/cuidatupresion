// hooks/useWindowWidth.ts
import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};
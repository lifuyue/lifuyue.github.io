import { useEffect, useState } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const updatePosition = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const updateHoverState = (event: Event) => {
      const target = event.target as HTMLElement | null;
      setIsHoveringInteractive(
        Boolean(target?.closest('a, button, input, textarea, [data-cursor="large"]')),
      );
    };

    const resetHoverState = () => setIsHoveringInteractive(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', updateHoverState);
    document.addEventListener('focusin', updateHoverState);
    document.addEventListener('mouseout', resetHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', updateHoverState);
      document.removeEventListener('focusin', updateHoverState);
      document.removeEventListener('mouseout', resetHoverState);
    };
  }, []);

  return { ...position, isHoveringInteractive };
}

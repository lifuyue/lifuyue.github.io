import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'lifuyue-loading-screen';

export function LoadingScreen() {
  const [visible, setVisible] = useState(() => !window.sessionStorage.getItem(STORAGE_KEY));
  const counterRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !counterRef.current || !overlayRef.current) {
      return;
    }

    const state = { progress: 0 };
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
        setVisible(false);
      },
    });

    timeline.to(state, {
      progress: 100,
      duration: 1.4,
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(state.progress)).padStart(3, '0');
        }
      },
    });

    timeline.to(
      overlayRef.current,
      {
        clipPath: 'inset(0 0 100% 0 round 2.5rem)',
        duration: 0.9,
      },
      '>-0.05',
    );

    return () => {
      timeline.kill();
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
      style={{ clipPath: 'inset(0 0 0% 0 round 0rem)' }}
    >
      <div className="space-y-3 text-center">
        <p className="font-display text-4xl text-foreground sm:text-5xl">Lifuyue</p>
        <p className="text-xs uppercase tracking-[0.5em] text-foreground/55">Loading Signal</p>
        <span ref={counterRef} className="text-sm text-accent">
          000
        </span>
      </div>
    </div>
  );
}

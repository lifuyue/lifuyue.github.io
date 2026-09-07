import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameX = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);

  return (
    <section ref={ref} className="signal-hero" aria-label="Lifuyue · Developer & builder">
      <div className="hero-person" aria-hidden="true">
        <img src="/images/lifuyue-cutout.webp" alt="" fetchPriority="high" width={1254} height={1254} />
      </div>
      <div className="hero-location">
        <p>Located in<br />Xiamen, China</p>
        <span aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" /><ellipse cx="20" cy="20" rx="7" ry="15" /><path d="M5 20h30M8 11h24M8 29h24" /></svg></span>
      </div>
      <motion.div className="hero-introduction" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="hero-direction" aria-hidden="true">↘</span>
        <h1>Hi, I build things<br />with AI agents<br />and ship them.</h1>
        <div className="hero-actions"><Link to="/works">View works ↗</Link><Link to="/blog">Read notes ↗</Link></div>
      </motion.div>
      <div className="hero-name-window" aria-label="Lifuyue">
        <motion.div className="hero-name-scroll" style={reduced ? undefined : { x: nameX }} aria-hidden="true">
          <div className="hero-name-track">
            <span>Lifuyue — </span><span>Lifuyue — </span><span>Lifuyue — </span><span>Lifuyue — </span>
          </div>
        </motion.div>
      </div>
      <div className="hero-edge-label">Developer / Builder / Thinker</div>
      <Link to="/#about" className="hero-scroll-cue" aria-label="向下浏览个人介绍">↓</Link>
    </section>
  );
}

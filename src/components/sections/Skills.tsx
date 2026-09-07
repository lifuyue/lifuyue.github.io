import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { skills } from '@/data/skills';

export function Skills() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const reduced = useReducedMotion();
  return (
    <section className="capabilities-section" id="practice"><div className="reset-section">
      <div className="section-meta"><span>03 / What I ship</span><span>Ideas into things that work.</span></div>
      <div className="capabilities-grid"><div className="capabilities-heading"><span className="practice-star" aria-hidden="true"><SymbolIcon name="asterisk" /></span><h2>Things I<br />actually<br /><span>deliver.</span></h2><p>我真正在做的事和交付的方式。</p></div>
        <div className="capabilities-list">{skills.map((skill, index) => <div className={`capability ${expanded === index ? 'is-expanded' : ''}`} key={skill.title}>
          <h3><button type="button" onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index} aria-controls={`capability-${index}`} id={`capability-trigger-${index}`}><span className="capability-number">0{index + 1}</span><span>{skill.title}</span><span className="capability-plus" aria-hidden="true">+</span></button></h3>
          <AnimatePresence initial={false}>{expanded === index && <motion.div id={`capability-${index}`} role="region" aria-labelledby={`capability-trigger-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} className="capability-content"><div><p>{skill.description}</p><div className="work-tags">{skill.items.map((item) => <span key={item}>{item}</span>)}</div></div></motion.div>}</AnimatePresence>
        </div>)}</div>
      </div>
    </div></section>
  );
}

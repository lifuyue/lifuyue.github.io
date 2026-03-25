import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Skills() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="What I Work With"
        title="Tools and skills I actually use."
        description="不是罗列会什么，而是这些东西我确实每天都在用，而且用在真实的项目里。"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: index * 0.08 }}
          >
            <GlassCard className="h-full min-h-[280px]">
              <div className="flex h-full flex-col">
                <p className="text-xs uppercase tracking-[0.35em] text-accent/80">
                  0{index + 1}
                </p>
                <h3 className="mt-6 font-display text-3xl text-foreground">{skill.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-foreground/70">{skill.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

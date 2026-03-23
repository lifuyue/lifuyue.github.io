import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Skills() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Capabilities"
        title="Systems for motion, structure, and story."
        description="我把视觉、交互和内容系统一起考虑。每一层都应该有自己的存在理由。"
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
                <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">
                  0{index + 1}
                </p>
                <h3 className="mt-6 font-display text-3xl text-white">{skill.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-zinc-300">{skill.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-200"
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

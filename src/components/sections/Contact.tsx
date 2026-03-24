import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { socials } from '@/data/socials';

export function Contact() {
  return (
    <section className="section-shell section-space">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(45,212,191,0.08),rgba(var(--line),0.04))] p-8 sm:p-10 lg:p-14">
        <div className="absolute inset-0 bg-noise opacity-80" />
        <div className="relative">
          <SectionHeading
            eyebrow="Contact"
            title="Open to building expressive products and sharper experiences."
            description="如果你在做需要更强叙事感和更高完成度的前端项目，可以直接联系我。"
          />
          <div className="flex flex-wrap gap-4">
            {socials.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <MagneticButton href={item.href}>{item.label}</MagneticButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { socials } from '@/data/socials';

export function Contact() {
  return (
    <section className="section-shell section-space relative">
      <div className="pointer-events-none absolute inset-x-0 -inset-y-16 bg-[linear-gradient(135deg,rgba(245,158,11,0.08),rgba(45,212,191,0.04),transparent)]" />
      <div className="relative">
        <SectionHeading
          eyebrow="Say Hi"
          title="Want to build something together?"
          description="不管是正经项目还是有意思的实验，都欢迎找我聊。邮件、Twitter 私信都行。"
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
    </section>
  );
}

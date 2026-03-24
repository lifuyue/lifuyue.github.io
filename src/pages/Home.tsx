import { About } from '@/components/sections/About';
import { AITools } from '@/components/sections/AITools';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';

export function Home() {
  return (
    <>
      <Hero />
      <AITools />
      <About />
      <Skills />
      <Contact />
    </>
  );
}

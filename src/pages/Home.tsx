import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { CinematicRail } from '@/components/sections/CinematicRail';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <CinematicRail />
      <Skills />
      <Contact />
    </>
  );
}

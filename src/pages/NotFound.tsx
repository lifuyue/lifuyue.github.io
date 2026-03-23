import { MagneticButton } from '@/components/ui/MagneticButton';

export function NotFound() {
  return (
    <section className="section-shell section-space">
      <div className="glass-panel flex min-h-[60vh] flex-col items-start justify-center rounded-[2.5rem] p-10 sm:p-14">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">404</p>
        <h1 className="mt-4 font-display text-5xl text-white sm:text-7xl">Page not found.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
          这个路径没有内容，或者页面已经被重新编排。返回首页继续浏览。
        </p>
        <div className="mt-8">
          <MagneticButton to="/">Back Home</MagneticButton>
        </div>
      </div>
    </section>
  );
}

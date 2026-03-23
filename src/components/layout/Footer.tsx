import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10">
      <div className="section-shell flex flex-col gap-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-white">Lifuyue</p>
          <p>Immersive frontend, editorial motion, and code-driven visual systems.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/works" className="hover:text-white">
            Works
          </Link>
          <Link to="/blog" className="hover:text-white">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}

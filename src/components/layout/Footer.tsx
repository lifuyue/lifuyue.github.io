import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-line/10 px-5 py-10 sm:px-8 lg:px-10">
      <div className="section-shell flex flex-col gap-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-foreground">Lifuyue</p>
          <p>全栈开发、AI Agent 工作流，以及从想法到交付的记录。</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="text-foreground/70 hover:text-foreground">
            Home
          </Link>
          <Link to="/works" className="text-foreground/70 hover:text-foreground">
            Works
          </Link>
          <Link to="/blog" className="text-foreground/70 hover:text-foreground">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}

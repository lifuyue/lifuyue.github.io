import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { socials } from '@/data/socials';

const links = [{ label: 'Home', to: '/' }, { label: 'Works', to: '/works' }, { label: 'Journal', to: '/blog' }, { label: 'Contact', to: '/#contact' }];

export function Navbar() {
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const { themePreference, setThemePreference } = useTheme();
  const close = () => dialog.current?.close();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 160);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => { dialog.current?.close(); }, [pathname, hash]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className={`reset-nav ${pathname === '/' ? 'reset-nav--home' : ''} ${scrolled ? 'nav-scrolled' : ''}`}>
      <Link to="/" className="reset-brand" aria-label="Lifuyue 首页"><span className="brand-mark"><SymbolIcon name="asterisk" /></span><span>Code by <strong>Lifuyue</strong></span></Link>
      <nav aria-label="主导航" className="reset-nav-links">{links.slice(1).map((link) => <Link key={link.to} to={link.to} aria-current={pathname === link.to ? 'page' : undefined}>{link.label}<span><SymbolIcon name="arrow-up-right" /></span></Link>)}</nav>
    </header>
    <button className={`menu-trigger ${scrolled ? 'is-visible' : ''}`} aria-label="打开导航菜单" aria-expanded={open} aria-controls="site-navigation" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><span /><span /></button>
    <dialog ref={dialog} id="site-navigation" className="navigation-dialog" aria-label="网站导航" data-lenis-prevent onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="navigation-sheet">
        <button autoFocus className="menu-close" aria-label="关闭导航菜单" onClick={close}>×</button>
        <p className="index-label">Navigation / Explore</p>
        <nav>{links.map((link, index) => <Link key={link.to} to={link.to} onClick={close} aria-current={pathname === link.to && !hash ? 'page' : undefined}><span className="menu-index">0{index + 1}</span><span>{link.label}</span><span className="menu-link-arrow"><SymbolIcon name="arrow-up-right" /></span></Link>)}</nav>
        <div className="menu-footer"><span className="index-label">Elsewhere</span><div className="menu-socials">{socials.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{social.label} <SymbolIcon name="arrow-up-right" /></a>)}</div>
          <div className="menu-theme"><label htmlFor="site-theme">Appearance</label><select id="site-theme" value={themePreference} onChange={(event) => setThemePreference(event.target.value as 'system' | 'light' | 'dark')}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></div>
        </div>
      </div>
    </dialog>
  </>;
}

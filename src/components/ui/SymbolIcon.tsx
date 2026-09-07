type SymbolName = 'arrow-up-right' | 'arrow-down-right' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'asterisk' | 'sun' | 'moon' | 'system';

const paths: Record<Exclude<SymbolName, 'system'>, string> = {
  'arrow-up-right': 'M5 19 19 5M5 5h14v14',
  'arrow-down-right': 'M5 5 19 19M5 19h14V5',
  'arrow-up': 'M12 21V3M4 11l8-8 8 8',
  'arrow-down': 'M12 3v18M4 13l8 8 8-8',
  'arrow-left': 'M21 12H3M11 4l-8 8 8 8',
  asterisk: 'M12 2v20M2 12h20M5 5l14 14M5 19 19 5',
  sun: 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z',
};

// Draw UI symbols instead of letting iOS substitute Apple Color Emoji glyphs.
export function SymbolIcon({ name }: { name: SymbolName }) {
  return <svg className="symbol-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'asterisk' ? 2.6 : 1.5} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false">
    {name === 'system' ? <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" /></> : <path d={paths[name]} />}
  </svg>;
}

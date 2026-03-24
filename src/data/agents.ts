import claudecodeColorSvg from '@/assets/logos/claudecode-color.svg?raw';
import claudecodeTextSvg from '@/assets/logos/claudecode-text.svg?raw';
import codexColorSvg from '@/assets/logos/codex-color.svg?raw';
import codexTextSvg from '@/assets/logos/codex-text.svg?raw';
import geminiColorSvg from '@/assets/logos/gemini-color.svg?raw';
import geminiTextSvg from '@/assets/logos/gemini-text.svg?raw';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  colorIcon: string;
  textIcon?: string | null;
  glowColor: string;
  chips?: string[];
}

export const heroAgents: AgentConfig[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    role: 'Planning',
    colorIcon: claudecodeColorSvg,
    textIcon: claudecodeTextSvg,
    glowColor: 'rgba(245, 158, 11, 0.34)',
    chips: ['/model opus', 'plan'],
  },
  {
    id: 'codex',
    name: 'Codex',
    role: 'Shipping',
    colorIcon: codexColorSvg,
    textIcon: codexTextSvg,
    glowColor: 'rgba(45, 212, 191, 0.4)',
    chips: ['code', 'review', 'implement'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Research',
    colorIcon: geminiColorSvg,
    textIcon: geminiTextSvg,
    glowColor: 'rgba(96, 165, 250, 0.38)',
  },
];

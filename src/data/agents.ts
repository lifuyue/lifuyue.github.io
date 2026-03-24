import claudeColorSvg from '@/assets/logos/claude-color.svg?raw';
import claudeTextSvg from '@/assets/logos/claude-text.svg?raw';
import claudecodeColorSvg from '@/assets/logos/claudecode-color.svg?raw';
import claudecodeTextSvg from '@/assets/logos/claudecode-text.svg?raw';
import codexColorSvg from '@/assets/logos/codex-color.svg?raw';
import codexTextSvg from '@/assets/logos/codex-text.svg?raw';
import geminiColorSvg from '@/assets/logos/gemini-color.svg?raw';
import geminiTextSvg from '@/assets/logos/gemini-text.svg?raw';
import openaiSvg from '@/assets/logos/openai.svg?raw';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  colorIcon: string;
  textIcon?: string | null;
  glowColor: string;
  chips?: string[];
}

export const agents: AgentConfig[] = [
  {
    id: 'claude-ai',
    name: 'Claude AI',
    role: 'Reasoning',
    colorIcon: claudeColorSvg,
    textIcon: claudeTextSvg,
    glowColor: 'rgba(245, 158, 11, 0.42)',
    chips: ['sonnet', 'opus', 'haiku'],
  },
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
  {
    id: 'openai',
    name: 'OpenAI',
    role: 'Foundation',
    colorIcon: openaiSvg,
    textIcon: null,
    glowColor: 'rgba(255, 255, 255, 0.24)',
  },
];

const heroAgentIds = new Set(['claude-code', 'codex', 'gemini']);

export const heroAgents = agents.filter((agent) => heroAgentIds.has(agent.id));

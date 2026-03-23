import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
      }),
    },
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
});

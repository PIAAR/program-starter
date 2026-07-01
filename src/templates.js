export const TEMPLATES = [
  {
    id: 'web-nextjs',
    label: 'Website (Next.js)',
    dir: 'web-nextjs',
    runtime: 'node',
    setupCommands: ['npm install'],
    needsDb: false,
  },
  {
    id: 'spa-vite-react',
    label: 'SPA (Vite + React)',
    dir: 'spa-vite-react',
    runtime: 'node',
    setupCommands: ['npm install'],
    needsDb: false,
  },
  {
    id: 'api-node-express',
    label: 'SaaS / API backend (Node + Express)',
    dir: 'api-node-express',
    runtime: 'node',
    setupCommands: ['npm install'],
    needsDb: true,
  },
  {
    id: 'api-python-fastapi',
    label: 'SaaS / API backend (Python + FastAPI)',
    dir: 'api-python-fastapi',
    runtime: 'python',
    setupCommands: ['conda env create -f environment.yml'],
    needsDb: true,
  },
  {
    id: 'cli-node',
    label: 'Terminal / CLI app (Node)',
    dir: 'cli-node',
    runtime: 'node',
    setupCommands: ['npm install'],
    needsDb: false,
  },
];

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id);
}

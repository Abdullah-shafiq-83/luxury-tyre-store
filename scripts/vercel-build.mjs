import { mkdirSync, cpSync, writeFileSync, rmSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Run Vite SPA build (npx resolves the local vite binary on all platforms)
execSync('npx vite build', { stdio: 'inherit' });

const out = '.vercel/output';

// Remove any injected server functions from a previous adapter run
if (existsSync(`${out}/functions`)) {
  rmSync(`${out}/functions`, { recursive: true, force: true });
}

// Place static assets where Vercel expects them
mkdirSync(`${out}/static`, { recursive: true });
cpSync('dist', `${out}/static`, { recursive: true });

// Write the Build Output API config — pure SPA, no server/edge functions
writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Long-lived cache for hashed assets
        {
          src: '/assets/(.*)',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
        // Serve real files first
        { handle: 'filesystem' },
        // Fall back to index.html for client-side routing
        { src: '/(.*)', dest: '/index.html' },
      ],
    },
    null,
    2
  )
);

console.log('✓ .vercel/output ready — pure SPA, no server functions');

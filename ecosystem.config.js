/**
 * PM2 Ecosystem Configuration — Pyxis Search Engine
 *
 * Single config managing both backend and frontend processes.
 * Cross-platform: Linux, macOS, and Windows.
 *
 * Usage:
 *   Start all:        pm2 start ecosystem.config.js
 *   Stop all:         pm2 stop ecosystem.config.js
 *   Restart all:      pm2 restart ecosystem.config.js
 *   Stop backend:     pm2 stop pyxis-backend
 *   Restart frontend: pm2 restart pyxis-frontend
 *   View logs:        pm2 logs
 *   Monitor:          pm2 monit
 */

const os = require('os');
const path = require('path');
const fs = require('fs');

function findPython() {
  const home = os.homedir();
  const isWin = process.platform === 'win32';
  const bin = isWin ? 'python.exe' : path.join('bin', 'python');

  const condaBases = [
    // Home directory installs (all OS) — most common
    path.join(home, 'miniconda3'),
    path.join(home, 'anaconda3'),
    path.join(home, 'miniforge3'),
    // System-wide Linux
    '/opt/miniconda3',
    '/opt/anaconda3',
    '/opt/miniforge3',
    '/usr/local/miniconda3',
    '/usr/local/anaconda3',
    // macOS Homebrew (Apple Silicon / Intel)
    '/opt/homebrew/anaconda3',
    '/opt/homebrew/miniconda3',
    '/usr/local/anaconda3',
    '/usr/local/miniconda3',
    // Windows system-wide
    'C:\\ProgramData\\miniconda3',
    'C:\\ProgramData\\anaconda3',
    'C:\\ProgramData\\miniforge3',
    // Windows user-local (non-admin)
    path.join(home, 'AppData', 'Local', 'miniconda3'),
    path.join(home, 'AppData', 'Local', 'anaconda3'),
  ];

  for (const base of condaBases) {
    const candidate = isWin
      ? path.join(base, 'envs', 'pyxis', bin)
      : path.join(base, 'envs', 'pyxis', bin);
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {}
    // Also try 'python3' binary on Unix (some distros only ship python3)
    if (!isWin) {
      try {
        const py3 = candidate.replace(/\/python$/, '/python3');
        if (fs.existsSync(py3)) return py3;
      } catch {}
    }
  }

  // Fallback — relies on the pyxis conda env being activated in the shell
  return isWin ? 'python' : 'python3';
}

module.exports = {
  apps: [
    // ── Flask Backend API ───────────────────────────────────────────
    {
      name: 'pyxis-backend',
      script: './backend/app.py',
      interpreter: findPython(),
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PYXIS_PORT: 5000
      }
    },

    // ── Next.js Frontend ────────────────────────────────────────────
    {
      name: 'pyxis-frontend',
      cwd: './frontend',
      script: 'node_modules/.bin/next',
      args: 'start -H 127.0.0.1',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

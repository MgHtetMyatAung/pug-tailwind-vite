import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
const distPath = path.resolve('dist');
const files = globSync(`${distPath}/**/*.html`).filter(f => !f.endsWith('index.html'));
files.forEach(file => {
  const fileName = path.basename(file, '.html');
  const dir = path.join(path.dirname(file), fileName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(file, path.join(dir, 'index.html'));
});

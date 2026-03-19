import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const projectRoot = process.cwd();
const indexTemplate = fs.readFileSync(path.resolve(projectRoot, 'index.html'), 'utf8');

const pugFiles = globSync('src/{pages,dev}/**/*.pug', { cwd: projectRoot });

pugFiles.forEach(file => {
  const name = path.basename(file, '.pug');
  if (name === 'index') return; // Skip index as it's the main entry

  const outputPath = path.resolve(projectRoot, `${name}.html`);
  // We don't need to change the data-src here because our vite.config.js 
  // dynamic router will handle it based on the name of the HTML file.
  fs.writeFileSync(outputPath, indexTemplate);
  console.log(`Created temporary entry: ${name}.html`);
});

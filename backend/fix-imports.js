import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controllersDir = path.join(__dirname, 'controllers');

// Get all controller files
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

console.log(`Fixing import paths in ${files.length} controller files...`);

files.forEach(file => {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add .js extension to relative imports that don't have it
  const updated = content.replace(/from ['"](\.\.[^'"]+)['"]/g, (match, importPath) => {
    if (!importPath.endsWith('.js') && !importPath.includes('node_modules')) {
      return `from '${importPath}.js'`;
    }
    return match;
  });
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ ${file} - fixed imports`);
  } else {
    console.log(`⏭️  ${file} - no changes needed`);
  }
});

console.log('\nImport path fixing complete!');

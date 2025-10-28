import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controllersDir = path.join(__dirname, 'controllers');

// Get all controller files
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js') && f !== 'index.js');

console.log(`Found ${files.length} controller files to convert...`);

files.forEach(file => {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already converted (has import statements)
  if (content.includes('import ') && content.includes('export ')) {
    console.log(`✅ ${file} - already ES6`);
    return;
  }
  
  // Convert require to import
  content = content.replace(/const (\w+) = require\('(.+?)'\);/g, (match, name, importPath) => {
    // Add .js extension if it's a relative path and doesn't have an extension
    if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
      importPath += '.js';
    }
    return `import ${name} from '${importPath}';`;
  });
  
  // Convert exports.functionName to export const functionName
  content = content.replace(/exports\.(\w+) = async/g, 'export const $1 = async');
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file} - converted`);
});

console.log('\nConversion complete!');

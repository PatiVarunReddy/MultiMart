import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'models');

// Get all model files
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

console.log(`Converting ${files.length} model files to ES6...`);

files.forEach(file => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already converted (has import statements and export default)
  if (content.includes('import mongoose from') && content.includes('export default')) {
    console.log(`✅ ${file} - already ES6`);
    return;
  }
  
  // Convert require to import
  content = content.replace(/const mongoose = require\('mongoose'\);/g, "import mongoose from 'mongoose';");
  content = content.replace(/const (\w+) = require\('(.+?)'\);/g, "import $1 from '$2';");
  
  // Convert module.exports to export default
  content = content.replace(/module\.exports = /g, 'export default ');
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file} - converted to ES6`);
});

console.log('\nModel conversion complete!');

const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(/text-\[\#8B6B7A\]/g, 'text-glowup-brand');
  content = content.replace(/bg-\[\#8B6B7A\]/g, 'bg-glowup-brand');
  content = content.replace(/border-\[\#8B6B7A\]/g, 'border-glowup-brand');
  content = content.replace(/ring-\[\#8B6B7A\]/g, 'ring-glowup-brand');
  content = content.replace(/accent-\[\#8B6B7A\]/g, 'accent-glowup-brand');
  content = content.replace(/hover:text-\[\#8B6B7A\]/g, 'hover:text-glowup-brand');
  content = content.replace(/hover:border-\[\#8B6B7A\]/g, 'hover:border-glowup-brand');
  content = content.replace(/hover:bg-\[\#73525f\]/g, 'hover:bg-glowup-pink-600');
  
  content = content.replace(/bg-\[\#FCF9F8\]/g, 'bg-glowup-bg');
  content = content.replace(/fill="\#8B6B7A"/g, 'fill="#DB2777"');
  content = content.replace(/fill="#8B6B7A"/g, 'fill="#DB2777"');

  content = content.replace(/style={{ background: "linear-gradient\(102deg, #8B6B7A 0%, #A98495 100%\)" }}/g, 'style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log('Updated ' + changedFiles + ' files.');

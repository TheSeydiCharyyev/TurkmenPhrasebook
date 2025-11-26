// Fix audio mapping - replace .mp3 with .m4a for files that actually have .m4a extension
const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, 'src', 'data', 'audioMapping.ts');
let content = fs.readFileSync(mappingPath, 'utf8');

// List of files that should be .m4a instead of .mp3
const m4aFiles = [
  'body/turkmen/19.1',
  'body/turkmen/19.10',
  'body/turkmen/19.2',
  'body/turkmen/19.3',
  'body/turkmen/19.4',
  'body/turkmen/19.5',
  'body/turkmen/19.6',
  'body/turkmen/19.7',
  'business/turkmen/16.1',
  'business/turkmen/16.11',
  'business/turkmen/16.12',
  'business/turkmen/16.2',
  'business/turkmen/16.3',
  'business/turkmen/16.4',
  'business/turkmen/16.5',
  'business/turkmen/16.6',
  'business/turkmen/16.7',
  'business/turkmen/16.8',
  'business/turkmen/16.9'
];

let fixCount = 0;

// Replace .mp3 with .m4a for these files
m4aFiles.forEach(file => {
  const mp3Pattern = new RegExp(`'${file}\\.mp3'`, 'g');
  const mp3RequirePattern = new RegExp(`${file.replace(/\//g, '\\/')}\\.mp3`, 'g');

  if (content.includes(`'${file}.mp3'`)) {
    content = content.replace(mp3Pattern, `'${file}.m4a'`);
    content = content.replace(mp3RequirePattern, `${file}.m4a`);
    fixCount++;
    console.log(`✓ Fixed: ${file}.mp3 → ${file}.m4a`);
  }
});

// Save the updated file
fs.writeFileSync(mappingPath, content, 'utf8');

console.log(`\n✅ Fixed ${fixCount} audio file references`);
console.log(`✅ Updated: ${mappingPath}`);

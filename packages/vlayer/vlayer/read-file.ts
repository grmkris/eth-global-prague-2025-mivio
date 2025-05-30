import fs from 'fs';

// Read file synchronously
const content = fs.readFileSync('prove.ts', 'utf-8');
console.log('File contents:', content);

// Or read file asynchronously
fs.readFile('prove.ts', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File contents (async):', data);
}); 
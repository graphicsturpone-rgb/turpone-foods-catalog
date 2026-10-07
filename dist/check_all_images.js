const fs = require('fs');

const transcriptPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\042fac39-0515-4f87-88d6-b830bd5c336c\\.system_generated\\logs\\transcript_full.jsonl';
const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');
const line = lines[3937];
const obj = JSON.parse(line);
const content = obj.content;

const gIdx = content.indexOf('"gallery":[');
const chunk = content.substring(gIdx, gIdx + 5000);
console.log('Sample chunk:', chunk.slice(0, 300));

// Count occurrences of "data:image/"
let count = 0;
let pos = 0;
while ((pos = content.indexOf('data:image/', pos)) !== -1) {
  count++;
  pos += 11;
}
console.log('Total data:image/ found in message:', count);
